import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export { cloudinary }

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, err)
  }
}

export function getCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {}
): string {
  const { width, height, quality = 'auto' } = options
  const transformations: string[] = [`q_${quality}`, 'f_auto']
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`, 'c_fill')
  return cloudinary.url(publicId, {
    transformation: transformations.join(','),
    secure: true,
  })
}
