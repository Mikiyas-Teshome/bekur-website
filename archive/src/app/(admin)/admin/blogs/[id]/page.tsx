"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Save, Eye, Calendar, Tag, Image as ImageIcon, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.any(),
  coverId: z.number().optional(),
  tagIds: z.array(z.number()),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface Media {
  id: number;
  url: string;
  mime: string;
  alt?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown> | null;
  cover?: Media;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCover, setSelectedCover] = useState<Media | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: null,
    coverId: undefined,
    tagIds: [],
  });
  const [blogId, setBlogId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setBlogId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
      fetchTags();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`);
      if (response.ok) {
        const blog: BlogPost = await response.json();
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverId: blog.cover?.id,
          tagIds: blog.tags.map((tag) => tag.id),
        });
        if (blog.cover) {
          setSelectedCover(blog.cover);
        }
      } else {
        toast.error("Failed to load blog post");
        router.push("/admin/blogs");
      }
    } catch (error) {
      toast.error("Failed to load blog post");
      router.push("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Failed to load tags");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCoverSelect = (media: Media | Media[]) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    setSelectedCover(selectedMedia);
    setFormData((prev) => ({
      ...prev,
      coverId: selectedMedia.id,
    }));
    setIsMediaPickerOpen(false);
  };

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags((prev) => [...prev, newTag]);
        setFormData((prev) => ({
          ...prev,
          tagIds: [...prev.tagIds, newTag.id],
        }));
        setNewTagName("");
        setIsTagDialogOpen(false);
        toast.success("Tag created");
      } else {
        toast.error("Failed to create tag");
      }
    } catch (error) {
      toast.error("Failed to create tag");
    }
  };

  const handleSave = async () => {
    try {
      const validatedData = blogSchema.parse(formData);
      setSaving(true);

      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        toast.success("Blog post updated successfully");
        router.push("/admin/blogs");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save blog post");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("Failed to save blog post");
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedTags = tags.filter((tag) => formData.tagIds.includes(tag.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 items-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/blogs")}
          className="dark:bg-background border-footer-border/50 dark:hover:bg-background/50 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className=" dark:text-white cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            {saving ? "Updating..." : "Update Blog"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  className="dark:bg-background border-footer-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="blog-post-slug"
                  className="dark:bg-background border-footer-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the blog post"
                  rows={3}
                  className="dark:bg-background border-footer-border/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="Start writing your blog post..."
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCover ? (
                <div className="space-y-2">
                  <img
                    src={selectedCover.url}
                    alt={selectedCover.alt || ""}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {selectedCover.alt || "Cover image"}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCover(null);
                        setFormData((prev) => ({
                          ...prev,
                          coverId: undefined,
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-32 border-dashed cursor-pointer"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Add cover image</p>
                  </div>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer dark:text-white"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTagDialogOpen(true)}
                  className="w-full dark:bg-background border-footer-border/50 dark:hover:bg-background/50 cursor-pointer"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
                <div className="space-y-1">
                  {tags
                    .filter((tag) => !formData.tagIds.includes(tag.id))
                    .map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-background/50 rounded dark:text-white cursor-pointer"
                      >
                        {tag.name}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Media picker */}
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleCoverSelect}
      />

      {/* Tag dialog */}
      {isTagDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-accent border-footer-border/50 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Tag</h3>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              className="mb-4 dark:bg-background border-footer-border/50"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateTag} className="dark:text-white cursor-pointer">Create</Button>
              <Button
                variant="outline"
                onClick={() => setIsTagDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
