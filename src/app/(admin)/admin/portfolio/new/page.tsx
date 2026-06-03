'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TipTapEditor } from '@/components/admin/TipTapEditor';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { 
  Save, 
  Eye, 
  Calendar,
  Tag,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  content: z.any(),
  galleryIds: z.array(z.number()),
  tagIds: z.array(z.number()),
  featured: z.boolean().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

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

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<Media[]>([]);
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    slug: '',
    shortDescription: '',
    content: null,
    galleryIds: [],
    tagIds: [],
    featured: false,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Failed to load tags');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleGallerySelect = (media: Media | Media[]) => {
    const selectedMedia = Array.isArray(media) ? media : [media];
    setSelectedGallery(selectedMedia);
    setFormData(prev => ({
      ...prev,
      galleryIds: selectedMedia.map(m => m.id),
    }));
    setIsMediaPickerOpen(false);
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setTags(prev => [...prev, newTag]);
        setFormData(prev => ({
          ...prev,
          tagIds: [...prev.tagIds, newTag.id],
        }));
        setNewTagName('');
        setIsTagDialogOpen(false);
        toast.success('Tag created');
      } else {
        toast.error('Failed to create tag');
      }
    } catch (error) {
      toast.error('Failed to create tag');
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        status: 'published',
        publishedAt: new Date().toISOString(),
      };

      const validatedData = portfolioSchema.parse(dataToSave);
      setSaving(true);

      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        const project = await response.json();
        toast.success('Portfolio project published successfully');
        router.push(`/admin/portfolio/${project.id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save portfolio project');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error('Failed to save portfolio project');
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedTags = tags.filter(tag => formData.tagIds.includes(tag.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Portfolio Project</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className=" dark:text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            {saving ? 'Publishing...' : 'Publish Project'}
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
              <div className='space-y-3'>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="dark:bg-background border-footer-border/50"
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter project title"
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  className="dark:bg-background border-footer-border/50"
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="project-slug"
                />
              </div>
              <div className='space-y-3'>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  className="dark:bg-background border-footer-border/50"
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content editor */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <TipTapEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Describe your project in detail..."
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedGallery.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedGallery.map((media) => (
                      <div key={media.id} className="relative">
                        <img
                          src={media.url}
                          alt={media.alt || ''}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => {
                            const newGallery = selectedGallery.filter(m => m.id !== media.id);
                            setSelectedGallery(newGallery);
                            setFormData(prev => ({
                              ...prev,
                              galleryIds: newGallery.map(m => m.id),
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="w-full dark:bg-background dark:hover:bg-background/50 cursor-pointer border-footer-border/50"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add More Images
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-32 border-dashed dark:bg-background border-footer-border/50 cursor-pointer dark:hover:bg-background/50"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Add project images</p>
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
                {selectedTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer"
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
                  {tags.filter(tag => !formData.tagIds.includes(tag.id)).map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, featured: checked === true }))
                  }
                />
                <Label
                  htmlFor="featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Featured Project
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Featured projects will appear on the homepage
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Media picker */}
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleGallerySelect}
        multiple={true}
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
              <Button variant="outline" className="cursor-pointer" onClick={() => setIsTagDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
