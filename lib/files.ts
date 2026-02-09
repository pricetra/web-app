export const CLOUDINARY_UPLOAD_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

export function createCloudinaryUrl(
  public_id: string,
  width?: number,
  height?: number,
  timestamp?: object | string | null,
) {
  let url = CLOUDINARY_UPLOAD_BASE;
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (transformations.length > 0) url += `/${transformations.join(",")}`;
  url += `/${public_id}`;
  let updatedAt = "";
  if (timestamp) {
    updatedAt = "?updatedAt=" + encodeURIComponent(timestamp.toString());
  }
  return url + updatedAt;
}

export function productImageUrlWithTimestamp(
  product: { code: string; updatedAt?: object | null },
  width?: number,
  height?: number,
) {
  return createCloudinaryUrl(product.code, width, height, product.updatedAt);
}

export async function convertFileToBase64(
  file: File,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
}
