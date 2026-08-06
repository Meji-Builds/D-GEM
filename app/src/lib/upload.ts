import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Vercel's serverless functions run on a read-only filesystem, so uploads
// there must go to Vercel Blob. Locally (no BLOB_READ_WRITE_TOKEN configured)
// fall back to writing into public/uploads for convenience.
export async function saveUploadedFile(
  file: File | null | undefined,
  prefix: string
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${prefix}-${randomUUID()}.${ext || "jpg"}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public", addRandomSuffix: false });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
