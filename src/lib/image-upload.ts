// Utility function to upload image files to MinIO
export const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const result = await response.json();
  return result.url;
};

// Utility function to validate image files
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  // Removed size limit - allow any size
  // const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Please select a valid image file (JPEG, PNG, GIF, WebP)";
  }

  // Removed size validation
  // if (file.size > maxSize) {
  //   return "Image size must be less than 5MB";
  // }

  return null;
};
