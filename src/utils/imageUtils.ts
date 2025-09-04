/**
 * Utility functions for working with images
 */

// Base path for local assets
const BASE_PATH = "/assets/images";

/**
 * Get the local path for an image
 * @param category - The image category (e.g., 'menu', 'restaurant')
 * @param imageName - The image name
 * @returns The local path to the image
 */
export function getLocalImagePath(category: string, imageName: string): string {
  return `${BASE_PATH}/${category}/${imageName}`;
}

/**
 * Check if an image exists locally, otherwise use the remote URL
 * @param localPath - The local path to check
 * @param remoteUrl - The remote URL to use as fallback
 * @returns The appropriate image path
 */
export function getImageSrc(localPath: string, remoteUrl: string): string {
  // In a real implementation, you might want to check if the file exists
  // For now, we'll just return the local path and assume it exists
  return localPath || remoteUrl;
}

/**
 * Convert a remote URL to a local filename
 * @param url - The remote URL
 * @returns A suitable local filename
 */
export function urlToFilename(url: string): string {
  // Extract the last part of the URL and remove query parameters
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1].split("?")[0];

  // If there's no extension, add .webp
  if (!lastPart.includes(".")) {
    return `${lastPart}.webp`;
  }

  return lastPart;
}
