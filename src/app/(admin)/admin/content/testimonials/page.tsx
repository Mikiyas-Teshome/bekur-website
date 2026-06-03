"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  MessageCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImageFile, validateImageFile } from "@/lib/image-upload";

interface Testimonial {
  id?: number;
  profileImage: string;
  username: string;
  description: string;
  joinedDate: string;
  order: number;
}

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadingTestimonials, setUploadingTestimonials] = useState<
    Set<number>
  >(new Set());

  // Refs for file inputs
  const newTestimonialFileInputRef = useRef<HTMLInputElement>(null);
  const testimonialFileInputRefs = useRef<Map<number, HTMLInputElement>>(
    new Map()
  );
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, "id">>(
    {
      profileImage: "",
      username: "",
      description: "",
      joinedDate: "",
      order: 0,
    }
  );

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(
          data.sort((a: Testimonial, b: Testimonial) => a.order - b.order)
        );
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonials),
      });

      if (response.ok) {
        toast.success("Testimonials saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving testimonials:", error);
      toast.error("Failed to save testimonials");
    } finally {
      setIsSaving(false);
    }
  };

  const addTestimonial = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new testimonials
      const maxId =
        testimonials.length > 0
          ? Math.max(...testimonials.map((t) => t.id || 0))
          : 0;
      const testimonial: Testimonial = {
        ...newTestimonial,
        id: maxId + 1,
        order: testimonials.length,
      };
      const updatedTestimonials = [...testimonials, testimonial];
      setTestimonials(updatedTestimonials);
      setNewTestimonial({
        profileImage: "",
        username: "",
        description: "",
        joinedDate: "",
        order: 0,
      });

      // Automatically save to database
      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTestimonials),
      });

      if (response.ok) {
        toast.success("Testimonial added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving testimonials:", error);
      toast.error("Failed to save testimonial");
      // Revert the local state if save failed
      setTestimonials(testimonials);
    } finally {
      setIsAdding(false);
    }
  };

  const updateTestimonial = (
    id: number,
    field: keyof Testimonial,
    value: string | number
  ) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      )
    );
  };

  const deleteTestimonial = (id: number) => {
    setTestimonials((prev) =>
      prev.filter((testimonial) => testimonial.id !== id)
    );
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingNew(true);
    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Upload file
      const uploadedUrl = await uploadImageFile(file);

      setNewTestimonial((prev) => ({ ...prev, profileImage: uploadedUrl }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingNew(false);
    }
  };

  // Optimized click handlers
  const handleNewTestimonialFileClick = useCallback(() => {
    newTestimonialFileInputRef.current?.click();
  }, []);

  const handleTestimonialFileClick = useCallback((testimonialId: number) => {
    const fileInput = testimonialFileInputRefs.current.get(testimonialId);
    fileInput?.click();
  }, []);

  const handleImageUploadForTestimonial = async (
    file: File,
    testimonialId: number
  ) => {
    setUploadingTestimonials((prev) => new Set(prev).add(testimonialId));
    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Upload file
      const uploadedUrl = await uploadImageFile(file);

      // Update testimonial's profile image in local state
      updateTestimonial(testimonialId, "profileImage", uploadedUrl);

      // Save the updated testimonials to database
      const updatedTestimonials = testimonials.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, profileImage: uploadedUrl }
          : testimonial
      );

      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTestimonials),
      });

      if (response.ok) {
        toast.success("Image uploaded and saved successfully");
      } else {
        throw new Error("Failed to save testimonial");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingTestimonials((prev) => {
        const newSet = new Set(prev);
        newSet.delete(testimonialId);
        return newSet;
      });
    }
  };

  const moveTestimonial = (fromIndex: number, toIndex: number) => {
    const newTestimonials = [...testimonials];
    const [movedTestimonial] = newTestimonials.splice(fromIndex, 1);
    newTestimonials.splice(toIndex, 0, movedTestimonial);

    // Update order values
    const updatedTestimonials = newTestimonials.map((testimonial, index) => ({
      ...testimonial,
      order: index,
    }));

    setTestimonials(updatedTestimonials);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Testimonials Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the testimonials displayed on the homepage
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Testimonial */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
          <CardDescription>
            Create a new testimonial to display on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newProfileImage" className="dark:text-foreground">Profile Image</Label>
              <div className="space-y-2">
                {/* Image Preview */}
                {newTestimonial.profileImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={newTestimonial.profileImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center space-x-2">
                  <input
                    ref={newTestimonialFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                    disabled={isUploadingNew}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="dark:bg-background border-footer-border/50 cursor-pointer"
                    size="sm"
                    onClick={handleNewTestimonialFileClick}
                    disabled={isUploadingNew}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingNew ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>

                {/* URL Input (fallback) */}
                <div className="text-sm text-gray-500 dark:text-foreground/50">Or enter URL:</div>
                <Input
                  id="newProfileImage"
                  className="dark:bg-background border-footer-border/50"
                  value={newTestimonial.profileImage}
                  onChange={(e) =>
                    setNewTestimonial((prev) => ({
                      ...prev,
                      profileImage: e.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUsername" className="dark:text-foreground">Username</Label>
              <Input
                id="newUsername"
                className="dark:bg-background border-footer-border/50"
                value={newTestimonial.username}
                onChange={(e) =>
                  setNewTestimonial((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newJoinedDate" className="dark:text-foreground">Joined Date</Label>
              <Input
                id="newJoinedDate"
                className="dark:bg-background border-footer-border/50"
                value={newTestimonial.joinedDate}
                onChange={(e) =>
                  setNewTestimonial((prev) => ({
                    ...prev,
                    joinedDate: e.target.value,
                  }))
                }
                placeholder="December 2024"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="newDescription" className="dark:text-foreground">Description</Label>
              <Textarea
                id="newDescription"
                className="dark:bg-background border-footer-border/50"
                value={newTestimonial.description}
                onChange={(e) =>
                  setNewTestimonial((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Testimonial description..."
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={addTestimonial}
            className=' dark:text-white'
            disabled={
              !newTestimonial.profileImage ||
              !newTestimonial.username ||
              !newTestimonial.description ||
              !newTestimonial.joinedDate ||
              isAdding
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Testimonial"}
          </Button>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Testimonials ({testimonials.length})
        </h2>
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id || `testimonial-${index}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{testimonial.order + 1}</Badge> */}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      {testimonial.profileImage ? (
                        <img
                          src={testimonial.profileImage}
                          alt={testimonial.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Profile Image</Label>
                      <div className="space-y-2">
                        {/* Image Preview */}
                        {testimonial.profileImage && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={testimonial.profileImage}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* File Input */}
                        <div className="flex items-center space-x-2">
                          <input
                            ref={(el) => {
                              if (el && testimonial.id) {
                                testimonialFileInputRefs.current.set(
                                  testimonial.id,
                                  el
                                );
                              }
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUploadForTestimonial(
                                  file,
                                  testimonial.id!
                                );
                              }
                            }}
                            className="hidden"
                            disabled={uploadingTestimonials.has(
                              testimonial.id!
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="dark:bg-background border-footer-border/50 cursor-pointer"
                            size="sm"
                            onClick={() =>
                              handleTestimonialFileClick(testimonial.id!)
                            }
                            disabled={uploadingTestimonials.has(
                              testimonial.id!
                            )}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingTestimonials.has(testimonial.id!)
                              ? "Uploading..."
                              : "Upload Image"}
                          </Button>
                        </div>

                        {/* URL Input (fallback) */}
                        <div className="text-sm text-gray-500 dark:text-foreground/50">
                          Or enter URL:
                        </div>
                        <Input
                          className="dark:bg-background border-footer-border/50"
                            value={testimonial.profileImage}
                          onChange={(e) =>
                            updateTestimonial(
                              testimonial.id!,
                              "profileImage",
                              e.target.value
                            )
                          }
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="dark:text-foreground">Username</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={testimonial.username}
                        onChange={(e) =>
                          updateTestimonial(
                            testimonial.id!,
                            "username",
                            e.target.value
                          )
                        }
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Joined Date</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={testimonial.joinedDate}
                        onChange={(e) =>
                          updateTestimonial(
                            testimonial.id!,
                            "joinedDate",
                            e.target.value
                          )
                        }
                        placeholder="December 2024"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="dark:text-foreground">Description</Label>
                      <Textarea
                        className="dark:bg-background border-footer-border/50"
                        value={testimonial.description}
                        onChange={(e) =>
                          updateTestimonial(
                            testimonial.id!,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Testimonial description..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:!bg-background border-footer-border/50 cursor-pointer"
                    onClick={() => deleteTestimonial(testimonial.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {testimonials.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No testimonials added yet.</p>
                <p className="text-sm">Add your first testimonial above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
