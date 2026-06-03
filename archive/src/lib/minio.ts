import { Client } from 'minio';

let minioClient: Client | null = null;

/**
 * Removes port number from a URL
 * Examples:
 * - https://example.com:9001 -> https://example.com
 * - http://example.com:9000 -> http://example.com
 * - https://example.com -> https://example.com (no change)
 */
const removePortFromUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    // Remove port if it's not the default port (80 for http, 443 for https)
    if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
      urlObj.port = '';
    }
    let result = urlObj.toString();
    // Remove trailing slash and fix double slashes
    result = result.replace(/\/$/, '').replace(/([^:]\/)\/+/g, '$1');
    return result;
  } catch (error) {
    // If URL parsing fails, try simple regex replacement
    console.warn('Failed to parse URL with URL constructor, using regex fallback:', url);
    try {
      return url.replace(/:\d+(\/|$)/, '$1').replace(/\/$/, '');
    } catch {
      console.error('Failed to process URL:', url, error);
      return url; // Return original if all else fails
    }
  }
};

export const getMinioClient = (): Client => {
  if (minioClient) {
    return minioClient;
  }

  minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });

  return minioClient;
};

export const uploadFile = async (
  file: Buffer,
  fileName: string,
  mimeType: string,
  bucketName: string = process.env.MINIO_BUCKET!
): Promise<string> => {
  try {
    const client = getMinioClient();
    
    // Ensure bucket exists
    try {
      const bucketExists = await client.bucketExists(bucketName);
      if (!bucketExists) {
        await client.makeBucket(bucketName, 'us-east-1');
      }
    } catch (bucketError) {
      console.error('Error checking/creating bucket:', bucketError);
      throw new Error(`Failed to access bucket "${bucketName}": ${bucketError instanceof Error ? bucketError.message : 'Unknown error'}`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Upload file
    try {
      await client.putObject(bucketName, uniqueFileName, file, file.length, {
        'Content-Type': mimeType,
      });
    } catch (putError) {
      console.error('Error uploading to MinIO:', putError);
      throw new Error(`Failed to upload file: ${putError instanceof Error ? putError.message : 'Unknown error'}`);
    }

    // Return public URL without port number
    let publicUrl = process.env.MINIO_PUBLIC_URL;
    if (!publicUrl) {
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      publicUrl = `${protocol}://${process.env.MINIO_ENDPOINT}`;
    }
    
    // Remove port from URL
    try {
      publicUrl = removePortFromUrl(publicUrl);
    } catch (urlError) {
      console.warn('Error removing port from URL, using original:', urlError);
      // Continue with original URL if port removal fails
    }
    
    const finalUrl = `${publicUrl}/${bucketName}/${uniqueFileName}`;
    return finalUrl;
  } catch (error) {
    console.error('uploadFile error:', error);
    throw error;
  }
};

export const deleteFile = async (
  fileName: string,
  bucketName: string = process.env.MINIO_BUCKET!
): Promise<void> => {
  const client = getMinioClient();
  await client.removeObject(bucketName, fileName);
};

export const getFileUrl = (fileName: string): string => {
  // Return public URL without port number
  let publicUrl = process.env.MINIO_PUBLIC_URL;
  if (!publicUrl) {
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    publicUrl = `${protocol}://${process.env.MINIO_ENDPOINT}`;
  }
  // Remove port from URL
  publicUrl = removePortFromUrl(publicUrl);
  return `${publicUrl}/${process.env.MINIO_BUCKET}/${fileName}`;
};

