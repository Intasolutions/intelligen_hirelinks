export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    // Cloudinary URLs (re-cropping an existing image) are cross-origin —
    // without this the canvas below is "tainted" and toBlob() silently
    // returns null instead of throwing.
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

// Renders the source image's `pixelCrop` rectangle onto a canvas sized to
// `outputWidth`/`outputHeight` (upscaling a too-small source down to fit,
// never up, so a small original doesn't get invented detail) and returns
// the result as a File ready to hand to the existing upload flow.
export async function cropImageToFile(
  imageSrc: string,
  pixelCrop: PixelCrop,
  outputWidth: number,
  outputHeight: number,
  fileName: string,
  mimeType = 'image/jpeg',
  quality = 0.92
): Promise<File> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, quality));
  if (!blob) throw new Error('Failed to generate cropped image.');

  return new File([blob], fileName, { type: mimeType });
}
