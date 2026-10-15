// utils/imageUpload.js
import crypto from "crypto";
import multer from "multer";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const MAX_FILES = 40;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 10 MB per file

// ---------- Cloudflare R2 client (S3-compatible) ----------
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ---------- Multer: keep files in memory so sharp can process buffers ----------
export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Atļauti tikai attēlu faili!"));
    }
    cb(null, true);
  },
}).array("images", MAX_FILES);

// ---------- Process one image with sharp and upload it ----------
const processAndUpload = async (file, folder) => {
  const buffer = await sharp(file.buffer)
    .rotate() // respect EXIF orientation
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`,
  };
};

// Uploads all files in parallel; if any fails, removes the ones already uploaded.
export const uploadCarImages = async (files = [], folder = "cars") => {
  const results = await Promise.allSettled(
    files.map((file) => processAndUpload(file, folder)),
  );

  const uploaded = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
  const failed = results.find((r) => r.status === "rejected");

  if (failed) {
    await deleteImages(uploaded.map((u) => u.key));
    throw failed.reason;
  }
  return uploaded; // [{ key, url }]
};

// Deletes everything under a "folder" (key prefix), e.g. "cars/<carId>".
// Use this when a car/post is deleted.
export const deleteFolder = async (folder) => {
  const prefix = `${folder.replace(/\/$/, "")}/`;
  let token;
  try {
    do {
      const list = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: token,
        }),
      );
      const keys = (list.Contents ?? []).map((o) => o.Key);
      await deleteImages(keys);
      token = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (token);
  } catch (err) {
    console.error("R2 folder cleanup failed:", err.message);
  }
};

export const deleteImages = async (keys = []) => {
  if (!keys.length) return;
  try {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      }),
    );
  } catch (err) {
    console.error("R2 cleanup failed:", err.message);
  }
};
