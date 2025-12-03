'use server';

import cloudinary from './cloudinary'

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
}

/**
 * Upload an image to Cloudinary (Server-side only)
 * @param file - File object or base64 string
 * @param folder - Optional folder name in Cloudinary
 * @returns Upload result with secure URL and public ID
 */
export async function uploadToCloudinary(
  file: File | string,
  folder: string = 'nye-bash/events'
): Promise<CloudinaryUploadResult> {
  try {
    let fileData: string

    // Convert File to base64 if needed
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fileData = `data:${file.type};base64,${buffer.toString('base64')}`
    } else {
      fileData = file
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Delete an image from Cloudinary (Server-side only)
 * @param publicId - The public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Get optimized Cloudinary URL for an image
 * @param publicId - The public ID of the image
 * @param width - Desired width
 * @param height - Desired height
 */
export async function getCloudinaryUrl(
  publicId: string,
  width?: number,
  height?: number
): Promise<string>   {
  const transformations = []
  
  if (width || height) {
    transformations.push(`w_${width || 'auto'},h_${height || 'auto'},c_fill`)
  }
  
  transformations.push('q_auto', 'f_auto')
  
  const cloudName = process.env.CLOUDINARY_NAME
  const transformation = transformations.join(',')
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`
}
