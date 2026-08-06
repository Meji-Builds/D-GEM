// Downscales and re-encodes an image file in the browser before upload, so
// a multi-megabyte phone camera photo never has to cross the network (or
// Server Actions' request body limit) at full size.
export async function compressImageFile(
  file: File,
  { maxDimension = 1600, quality = 0.82 }: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  // Preserve transparency for PNGs (logos often rely on it) instead of
  // flattening to JPEG, which would turn transparent areas solid black.
  const keepAlpha = file.type === "image/png";
  if (!keepAlpha) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const outType = keepAlpha ? "image/png" : "image/jpeg";
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, outType, keepAlpha ? undefined : quality)
  );
  if (!blob || blob.size >= file.size) return file;

  const ext = keepAlpha ? "png" : "jpg";
  const newName = file.name.replace(/\.[^.]+$/, "") + "." + ext;
  return new File([blob], newName, { type: outType });
}

// Swaps a file input's selected file for a compressed version in place, so
// the surrounding <form> keeps working exactly as before (still just a
// plain file input submitted with the rest of the form).
export async function compressFileInput(input: HTMLInputElement) {
  const file = input.files?.[0];
  if (!file) return;
  const compressed = await compressImageFile(file);
  if (compressed === file) return;
  const dt = new DataTransfer();
  dt.items.add(compressed);
  input.files = dt.files;
}
