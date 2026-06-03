// Image compression utility for client-side optimization
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let objectUrl: string | null = null;

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Clean up object URL
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error('Image load failed'));
    };
    
    objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  });
};

export const validateAndCompressImage = async (file: File): Promise<File> => {
  // Validate file type (allow SVGs as well)
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP, SVG)');
  }

  // Do not attempt to compress SVGs (vector format)
  if (file.type === 'image/svg+xml') {
    return file;
  }

  // Target size: 900KB to be safe (many nginx configs default to 1MB)
  // This gives us a safety margin to avoid 413 errors
  const targetSize = 900 * 1024; // 900KB - conservative target
  const compressionThreshold = 800 * 1024; // 800KB - compress images over 800KB
  
  // If file is already small enough, return as-is
  if (file.size <= targetSize) {
    return file;
  }

  
  let bestFile = file; // Start with original
  let bestSize = file.size;
  
  // Try progressive compression levels - more aggressive to hit target size
  const compressionLevels = [
    { width: 1920, height: 1080, quality: 0.80, name: 'high' },
    { width: 1600, height: 900, quality: 0.70, name: 'medium' },
    { width: 1280, height: 720, quality: 0.60, name: 'low' },
    { width: 1024, height: 768, quality: 0.50, name: 'very-low' },
    { width: 800, height: 600, quality: 0.40, name: 'minimum' },
    { width: 640, height: 480, quality: 0.35, name: 'ultra-low' },
  ];
  
  for (const level of compressionLevels) {
    try {
      const compressedFile = await compressImage(file, level.width, level.height, level.quality);
      
      // If compression actually reduced size, use it
      if (compressedFile.size < bestSize) {
        bestFile = compressedFile;
        bestSize = compressedFile.size;
        
        // If we're under target, we're done
        if (compressedFile.size <= targetSize) {
          break;
        }
      } else {
        // If compression increases size, stop trying more aggressive levels
        break;
      }
    } catch {
      // Continue to next level if one fails
      continue;
    }
  }
  
  const sizeReduction = ((file.size - bestSize) / file.size * 100).toFixed(1);
  
  // If we couldn't compress below target, warn but still return best attempt
  if (bestSize > targetSize) {
  }
  
  return bestFile;
};
