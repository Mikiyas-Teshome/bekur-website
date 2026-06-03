'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, X, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { validateAndCompressImage } from '@/lib/image-compression';

interface Media {
  id: number;
  url: string;
  mime: string;
  width?: number;
  height?: number;
  size?: number;
  alt?: string;
  createdAt: string;
}

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media | Media[]) => void;
  multiple?: boolean;
}

export function MediaPicker({ open, onOpenChange, onSelect, multiple = false }: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  // Store XHR objects for cancellation
  const uploadXhrRef = useRef<{ [key: string]: XMLHttpRequest }>({});

  useEffect(() => {
    if (open) {
      fetchMedia();
    } else {
      // Clean up any ongoing uploads when dialog closes
      Object.values(uploadXhrRef.current).forEach(xhr => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          xhr.abort();
        }
      });
      uploadXhrRef.current = {};
      setUploadProgress({});
      setUploading(false);
    }
  }, [open]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media', {
        credentials: 'include', // Include cookies for authentication
      });
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      } else {
        toast.error('Failed to load media');
      }
    } catch {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress({});
    
    try {
      for (const file of Array.from(files)) {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Compress image if it's an image file
          let processedFile = file;
          if (file.type.startsWith('image/')) {
            // Show compression status for files that need compression (> 1MB)
            const needsCompression = file.size > 1 * 1024 * 1024;
            if (needsCompression) {
              const fileName = file.name;
              const originalSize = (file.size / 1024 / 1024).toFixed(2);
              setUploadProgress(prev => ({ 
                ...prev, 
                [fileId]: -1 // Use -1 to indicate compression in progress
              }));
              toast.info(`Compressing ${fileName} (${originalSize}MB)...`, { duration: 2000 });
            }
            
            try {
              processedFile = await validateAndCompressImage(file);
              const finalSize = (processedFile.size / 1024 / 1024).toFixed(2);
              const maxSafeSize = 1 * 1024 * 1024; // 1MB - conservative limit to avoid nginx 413 errors
              
              // Check if file is still too large after compression
              if (processedFile.size > maxSafeSize) {
                const errorMsg = `Image ${file.name} is too large (${finalSize}MB) even after compression. Maximum safe size is 1MB.`;
                console.error(errorMsg);
                toast.error(errorMsg, { 
                  description: 'The file exceeds server upload limits. Please try a smaller image or contact your administrator to increase nginx client_max_body_size.',
                  duration: 10000
                });
                // Clear progress and skip this file
                setUploadProgress(prev => {
                  const newProgress = { ...prev };
                  delete newProgress[fileId];
                  return newProgress;
                });
                continue; // Skip to next file
              }
              
              // Log compression results
              if (needsCompression && processedFile.size < file.size) {
                const reduction = ((file.size - processedFile.size) / file.size * 100).toFixed(1);
              } else if (needsCompression) {
                console.warn(`Compression did not reduce size: ${file.name} - using original`);
              }
              
              // Update progress after compression
              setUploadProgress(prev => ({ 
                ...prev, 
                [fileId]: 0 // Reset to 0 for actual upload
              }));
            } catch (compressionError) {
              console.error('Compression error:', compressionError);
              
              // If compression fails and original is too large, reject it
              const maxSafeSize = 1 * 1024 * 1024; // 1MB - conservative limit
              if (file.size > maxSafeSize) {
                const errorMsg = `Compression failed for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB). File is too large to upload.`;
                console.error(errorMsg);
                toast.error(errorMsg, { 
                  description: 'Please try a smaller image or contact your administrator to increase nginx client_max_body_size.',
                  duration: 10000
                });
                // Clear progress and skip this file
                setUploadProgress(prev => {
                  const newProgress = { ...prev };
                  delete newProgress[fileId];
                  return newProgress;
                });
                continue; // Skip to next file
              }
              
              // If compression fails but file is small enough, use original
              processedFile = file;
              setUploadProgress(prev => ({ 
                ...prev, 
                [fileId]: 0
              }));
              toast.warning(`Compression failed for ${file.name}, uploading original`, { duration: 3000 });
            }
          }

          const formData = new FormData();
          formData.append('file', processedFile);

          // Create XMLHttpRequest for progress tracking
          const xhr = new XMLHttpRequest();
          // Store XHR for cancellation
          uploadXhrRef.current[fileId] = xhr;
          
          const uploadPromise = new Promise((resolve, reject) => {
            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
              }
            });

            xhr.addEventListener('load', () => {
              try {
                if (xhr.status === 201) {
                  let data;
                  try {
                    data = JSON.parse(xhr.responseText);
                  } catch (parseError) {
                    console.error('Failed to parse response:', parseError, xhr.responseText);
                    toast.error(`Failed to parse server response for ${file.name}`);
                    reject(new Error('Invalid server response'));
                    return;
                  }
                  
                  // Validate response has required fields
                  if (!data || !data.id || !data.url) {
                    console.error('Invalid response format:', data);
                    toast.error(`Invalid response format for ${file.name}`);
                    reject(new Error('Invalid response format'));
                    return;
                  }
                  
                  setMedia(prev => [data, ...prev]);
                  toast.success(`Uploaded ${file.name}`);
                  // Refresh media list to ensure consistency
                  setTimeout(() => {
                    fetchMedia().catch(err => console.error('Failed to refresh media:', err));
                  }, 500);
                  resolve(data);
                } else {
                  let error;
                  try {
                    error = JSON.parse(xhr.responseText);
                  } catch (parseError) {
                    // Handle HTML error responses (like nginx 413 errors)
                    const responseText = xhr.responseText || '';
                    if (xhr.status === 413 || responseText.includes('413') || responseText.includes('Request Entity Too Large')) {
                      error = { 
                        error: 'File too large for upload (413 Error)',
                        details: 'Nginx is blocking the upload. The server administrator needs to increase client_max_body_size in nginx configuration. See NGINX_CONFIG.md for instructions.',
                        code: 413
                      };
                    } else if (responseText.includes('<html>')) {
                      // Try to extract error message from HTML
                      const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
                      const h1Match = responseText.match(/<h1>(.*?)<\/h1>/i);
                      const errorMessage = titleMatch?.[1] || h1Match?.[1] || `Server error (${xhr.status})`;
                      error = { 
                        error: errorMessage,
                        code: xhr.status
                      };
                    } else {
                      error = { 
                        error: `Server error (${xhr.status})`,
                        details: 'Unable to parse server response',
                        code: xhr.status
                      };
                    }
                    console.error('Failed to parse error response:', parseError, 'Status:', xhr.status, 'Response preview:', responseText.substring(0, 200));
                  }
                  
                  toast.error(`Failed to upload ${file.name}: ${error.error || 'Unknown error'}`, {
                    description: error.details,
                    duration: error.code === 413 ? 8000 : 5000
                  });
                  reject(new Error(error.error || 'Upload failed'));
                }
              } catch (error) {
                console.error('Error handling upload response:', error);
                toast.error(`Failed to process upload response for ${file.name}`);
                reject(error instanceof Error ? error : new Error('Unknown error'));
              }
            });

            xhr.addEventListener('error', (event) => {
              console.error('XHR error event:', event);
              toast.error(`Network error uploading ${file.name}`);
              reject(new Error('Network error during upload'));
            });

            xhr.addEventListener('abort', () => {
              toast.info(`Upload cancelled: ${file.name}`);
              // Clear progress on abort
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[fileId];
                return newProgress;
              });
              // Remove XHR from ref
              delete uploadXhrRef.current[fileId];
              reject(new Error('Upload cancelled'));
            });

            xhr.open('POST', '/api/admin/media/upload');
            xhr.withCredentials = true; // Include cookies for authentication
            xhr.send(formData);
          });

          await uploadPromise;
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast.error(`Failed to process ${file.name}: ${errorMessage}`);
        } finally {
          // Clear progress and XHR reference after upload completes (success or error)
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
          // Remove XHR from ref
          delete uploadXhrRef.current[fileId];
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (media: Media) => {
    if (multiple) {
      setSelectedMedia(prev => {
        const exists = prev.find(m => m.id === media.id);
        if (exists) {
          return prev.filter(m => m.id !== media.id);
        } else {
          return [...prev, media];
        }
      });
    } else {
      onSelect(media);
      onOpenChange(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect(selectedMedia);
    } else {
      selectedMedia.forEach(media => onSelect(media));
    }
    onOpenChange(false);
    setSelectedMedia([]);
  };

  const handleDeleteMedia = (mediaItem: Media, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card selection when clicking delete
    setMediaToDelete(mediaItem);
    setIsBulkDelete(false);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    if (selectedMedia.length === 0) return;
    setMediaToDelete(null);
    setIsBulkDelete(true);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        // Delete all selected media items
        const deletePromises = selectedMedia.map(media => 
          fetch(`/api/admin/media/${media.id}`, { 
            method: 'DELETE',
            credentials: 'include' // Include cookies for authentication
          })
        );
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.ok).length;
        
        if (successCount === selectedMedia.length) {
          // Remove all selected items from local state
          const selectedIds = selectedMedia.map(m => m.id);
          setMedia(prev => prev.filter(m => !selectedIds.includes(m.id)));
          setSelectedMedia([]);
          toast.success(`${successCount} media item(s) deleted successfully`);
        } else {
          throw new Error('Some deletions failed');
        }
      } else if (mediaToDelete) {
        // Delete single media item
        const response = await fetch(`/api/admin/media/${mediaToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          // Remove from local state
          setMedia(prev => prev.filter(m => m.id !== mediaToDelete.id));
          setSelectedMedia(prev => prev.filter(m => m.id !== mediaToDelete.id));
          toast.success('Media deleted successfully');
        } else {
          throw new Error('Delete failed');
        }
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    } finally {
      setShowDeleteDialog(false);
      setMediaToDelete(null);
      setIsBulkDelete(false);
    }
  };

  const filteredMedia = media.filter(m => 
    m.alt?.toLowerCase().includes(search.toLowerCase()) ||
    m.mime.toLowerCase().includes(search.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCancelUpload = (fileId: string) => {
    const xhr = uploadXhrRef.current[fileId];
    if (xhr) {
      xhr.abort();
      // Progress will be cleared by the abort event listener
    }
  };

  const isImage = (mime: string) => mime.startsWith('image/');
  const isVideo = (mime: string) => mime.startsWith('video/');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 dark:bg-background border-footer-border/50"
              />
            </div>
          </div>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
              // Remove any size restrictions
            />
            <Button disabled={uploading} className="dark:text-white">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            {uploading && Object.keys(uploadProgress).length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 space-y-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {Object.entries(uploadProgress).map(([fileId, progress]) => {
                  const isCompressing = progress === -1;
                  return (
                    <div key={fileId} className="text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="truncate flex-1 mr-2">{fileId.split('-')[0]}</span>
                        <div className="flex items-center gap-2">
                          {isCompressing ? (
                            <span className="text-blue-600 dark:text-blue-400">Compressing...</span>
                          ) : (
                            <span>{progress}%</span>
                          )}
                          {!isCompressing && (
                            <button
                              onClick={() => handleCancelUpload(fileId)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              aria-label="Cancel upload"
                              title="Cancel upload"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        {isCompressing ? (
                          <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }} />
                        ) : (
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedMedia.some(m => m.id === item.id);
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-2 group">
                        {isImage(item.mime) ? (
                          <Image
                            src={item.url}
                            alt={item.alt || ''}
                            fill
                            className="w-full h-full object-cover"
                          />
                        ) : isVideo(item.mime) ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Delete button - appears on hover */}
                        <button
                          onClick={(e) => handleDeleteMedia(item, e)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Delete media"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-500 text-white rounded-full p-1">
                              <X className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 truncate">
                          {item.alt || 'Untitled'}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {item.mime.split('/')[1]?.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(item.size)}
                          </span>
                        </div>
                        {item.width && item.height && (
                          <p className="text-xs text-gray-500">
                            {item.width} × {item.height}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {filteredMedia.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>No media found</p>
                <p className="text-sm">Upload some files to get started</p>
              </div>
            )}
          </div>
        )}

        {multiple && selectedMedia.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button variant="outline" onClick={() => setSelectedMedia([])}>
                Clear
              </Button>
              <Button onClick={handleConfirmSelection}>
                Select {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isBulkDelete ? (
              <p>
                Are you sure you want to delete <strong>{selectedMedia.length}</strong> media item(s)? 
                This action cannot be undone.
              </p>
            ) : (
              <p>
                Are you sure you want to delete <strong>&quot;{mediaToDelete?.alt || 'Untitled'}&quot;</strong>? 
                This action cannot be undone.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
