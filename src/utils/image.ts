export async function toPng28x28(file: File): Promise<File> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 28;
  canvas.height = 28;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 28, 28);
  ctx.drawImage(img, 0, 0, 28, 28);

  const blob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), "image/png", 1)
  );
  const name = file.name.replace(/\.\w+$/, "") + "_28x28.png";
  return new File([blob], name, { type: "image/png" });
}

export function isImage(file?: File | null) {
  if (!file) return false;
  return /^image\/(png|jpeg|jpg|bmp|gif|webp)$/.test(file.type);
}
