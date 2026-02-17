const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type CompressionResult = {
  file: File;
  compressed: boolean;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal membaca gambar."));
    };

    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal mengompres gambar."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function buildCompressedFilename(originalName: string, mimeType: string) {
  const baseName = originalName.replace(/\.[^.]+$/, "");
  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  return `${baseName}.${ext}`;
}

export async function compressImageIfNeeded(file: File): Promise<CompressionResult> {
  if (file.size <= MAX_IMAGE_BYTES) {
    return { file, compressed: false };
  }

  const image = await loadImageFromFile(file);
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const maxInitialDimension = 1920;
  const largerSide = Math.max(width, height);
  if (largerSide > maxInitialDimension) {
    const scale = maxInitialDimension / largerSide;
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia.");

  const mimeType = file.type === "image/webp" ? "image/webp" : "image/jpeg";
  let quality = 0.88;
  let bestBlob: Blob | null = null;

  for (let i = 0; i < 10; i += 1) {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, mimeType, quality);
    bestBlob = blob;

    if (blob.size <= MAX_IMAGE_BYTES) {
      const compressedFile = new File(
        [blob],
        buildCompressedFilename(file.name, mimeType),
        {
          type: mimeType,
          lastModified: Date.now(),
        },
      );
      return { file: compressedFile, compressed: true };
    }

    if (quality > 0.55) {
      quality -= 0.08;
      continue;
    }

    width = Math.max(800, Math.round(width * 0.85));
    height = Math.max(800, Math.round(height * 0.85));
    quality = 0.8;
  }

  if (!bestBlob || bestBlob.size > MAX_IMAGE_BYTES) {
    throw new Error("Gambar terlalu besar dan tidak bisa dikompres <= 2MB.");
  }

  const fallbackFile = new File(
    [bestBlob],
    buildCompressedFilename(file.name, mimeType),
    {
      type: mimeType,
      lastModified: Date.now(),
    },
  );
  return { file: fallbackFile, compressed: true };
}

export { MAX_IMAGE_BYTES };
