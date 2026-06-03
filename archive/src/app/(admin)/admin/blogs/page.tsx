'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover?: {
    id: number;
    url: string;
    alt?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        toast.error('Failed to load blogs');
      }
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/blogs/${blogToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(prev => prev.filter(blog => blog.id !== blogToDelete.id));
        toast.success('Blog post deleted successfully');
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (error) {
      toast.error('Failed to delete blog post');
    } finally {
      setDeleting(false);
      setBlogToDelete(null);
    }
  };


  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button asChild className=' dark:text-white'>
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="dark:bg-background border-footer-border/50 pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog posts table */}
      <Card>
        <CardContent className="p-0">
          <Table className=' min-w-[800px]'>
            <TableHeader>
              <TableRow className=''>
                <TableHead className='dark:!text-white'>Title</TableHead>
                <TableHead className='dark:!text-white'>Published</TableHead>
                <TableHead className='dark:!text-white'>Updated</TableHead>
                <TableHead className="text-right dark:!text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {blog.cover ? (
                        <img
                          src={blog.cover.url}
                          alt={blog.cover.alt || ''}
                          className="hidden sm:block w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="hidden sm:block w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{blog.title}</p>
                        {/* <p className="text-sm text-gray-500 dark:text-foreground/50 line-clamp-2">{blog.excerpt}</p> */}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {blog.publishedAt ? (
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-foreground/80">
                        <Calendar className="hidden sm:block h-4 w-4" />
                        {formatDate(blog.publishedAt)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not published</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-foreground/80">
                      <Calendar className="hidden sm:block h-4 w-4" />
                      {formatDate(blog.updatedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end sm:gap-2 -gap-2 -mr-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/blogs/${blog.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(blog)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredBlogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No blog posts found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
