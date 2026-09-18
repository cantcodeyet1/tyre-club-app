/**
 * Reads an image file, downscales it to fit within maxWidth/maxHeight, and
 * re-encodes as a compressed JPEG data URL. Keeps captured vehicle photos
 * small enough to store directly as text in Postgres without needing a
 * separate file-storage provider.
 */
export function resizeImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Could not read the image file'));
    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error('Could not load the image'));
      img.onload = () => {
        const scale = Math.min(
          1,
          maxWidth / img.width,
          maxHeight / img.height,
        );
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas is not supported on this device'));

          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
