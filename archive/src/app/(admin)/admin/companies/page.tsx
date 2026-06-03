'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  Globe,
  MapPin,
  Users,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { MediaPicker } from '@/components/admin/MediaPicker';

interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  logo?: {
    id: number;
    url: string;
    alt?: string;
  };
  location: string;
  industry: string;
  size: string;
  founded: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    size: '',
    founded: '',
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.sort((a: Company, b: Company) => a.order - b.order));
      } else {
        toast.error('Failed to load companies');
      }
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      location: '',
      industry: '',
      size: '',
      founded: '',
      isActive: true,
      isFeatured: false,
      order: companies.length + 1,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingCompany ? `/api/admin/companies/${editingCompany.id}` : '/api/admin/companies';
      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedCompany = await response.json();
        if (editingCompany) {
          setCompanies(prev => prev.map(c => c.id === editingCompany.id ? savedCompany : c));
        } else {
          setCompanies(prev => [...prev, savedCompany].sort((a, b) => a.order - b.order));
        }
        setIsDialogOpen(false);
        toast.success(`Company ${editingCompany ? 'updated' : 'created'}`);
      } else {
        toast.error('Failed to save company');
      }
    } catch (error) {
      toast.error('Failed to save company');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompanies(prev => prev.filter(company => company.id !== id));
        toast.success('Company deleted');
      } else {
        toast.error('Failed to delete company');
      }
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleImageSelect = (media: { url: string; alt?: string; id: number } | { url: string; alt?: string; id: number }[]) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    setFormData(prev => ({
      ...prev,
      logo: {
        id: selectedMedia.id,
        url: selectedMedia.url,
        alt: selectedMedia.alt,
      },
    }));
    setIsMediaPickerOpen(false);
  };

  const getSizeColor = (size: string) => {
    switch (size.toLowerCase()) {
      case 'startup': return 'bg-green-100 text-green-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-purple-100 text-purple-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Company
        </Button>
      </div>

      {/* Companies grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className={`relative ${company.isFeatured ? 'ring-2 ring-yellow-500' : ''}`}>
            {company.isFeatured && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo.url}
                      alt={company.logo.alt || ''}
                      className="w-12 h-12 object-contain rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <Switch
                  checked={company.isActive}
                  onCheckedChange={(checked) => {
                    setCompanies(prev => prev.map(c => 
                      c.id === company.id ? { ...c, isActive: checked } : c
                    ));
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{company.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {company.size}
                </div>
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Globe className="h-4 w-4" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {company.founded && (
                  <div className="text-sm text-gray-500">
                    Founded: {company.founded}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(company)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(company.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingCompany ? 'Edit Company' : 'Create Company'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Acme Corporation"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Company description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Company Size</Label>
                  <select
                    id="size"
                    value={formData.size || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Size</option>
                    <option value="Startup">Startup (1-10)</option>
                    <option value="Small">Small (11-50)</option>
                    <option value="Medium">Medium (51-200)</option>
                    <option value="Large">Large (201-1000)</option>
                    <option value="Enterprise">Enterprise (1000+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <Label>Logo</Label>
                {formData.logo ? (
                  <div className="space-y-2">
                    <img
                      src={formData.logo.url}
                      alt={formData.logo.alt || ''}
                      className="w-24 h-24 object-contain rounded border"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, logo: undefined }))}
                    >
                      Remove Logo
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-24 h-24 border-dashed"
                    onClick={() => setIsMediaPickerOpen(true)}
                  >
                    <div className="text-center">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-600">Add Logo</p>
                    </div>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label>Featured</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave}>
                {editingCompany ? 'Update' : 'Create'} Company
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media picker */}
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
