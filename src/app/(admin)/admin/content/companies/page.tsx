"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Trash2, GripVertical, Building2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaPicker } from '@/components/admin/MediaPicker';

interface Company {
  id?: number;
  name: string;
  logo: string;
  darkLogo?: string;
  order: number;
}

export default function CompaniesEditor() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [logoTarget, setLogoTarget] = useState<{ scope: 'new' | 'existing'; variant: 'light' | 'dark'; id?: number } | null>(null);
  const [newCompany, setNewCompany] = useState<Omit<Company, "id">>({
    name: "",
    logo: "",
    order: 0,
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/admin/companies");
      if (response.ok) {
        const data = await response.json();
        const sortedCompanies = data.sort(
          (a: Company, b: Company) => a.order - b.order
        );
        setCompanies(sortedCompanies);
      }
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companies),
      });

      if (response.ok) {
        toast.success("Companies saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save companies");
    } finally {
      setIsSaving(false);
    }
  };

  const addCompany = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new companies
      const maxId =
        companies.length > 0 ? Math.max(...companies.map((c) => c.id || 0)) : 0;
      const company: Company = {
        ...newCompany,
        id: maxId + 1,
        order: companies.length,
      };

      const updatedCompanies = [...companies, company];
      setCompanies(updatedCompanies);
      setNewCompany({ name: "", logo: "", order: 0 });

      // Automatically save to database
      const response = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCompanies),
      });

      if (response.ok) {
        toast.success("Company added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save company");
      // Revert the local state if save failed
      setCompanies(companies);
    } finally {
      setIsAdding(false);
    }
  };

  const updateCompany = (
    id: number,
    field: keyof Company,
    value: string | number
  ) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, [field]: value } : company
      )
    );
  };

  const askDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setIsConfirmOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete?.id) return;
    try {
      const response = await fetch(`/api/admin/companies/${companyToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      setCompanies((prev) => prev.filter((company) => company.id !== companyToDelete.id));
      toast.success('Company deleted');
    } catch (error) {
      toast.error('Failed to delete company');
    } finally {
      setIsConfirmOpen(false);
      setCompanyToDelete(null);
    }
  };

  const moveCompany = (fromIndex: number, toIndex: number) => {
    const newCompanies = [...companies];
    const [movedCompany] = newCompanies.splice(fromIndex, 1);
    newCompanies.splice(toIndex, 0, movedCompany);

    // Update order values
    const updatedCompanies = newCompanies.map((company, index) => ({
      ...company,
      order: index,
    }));

    setCompanies(updatedCompanies);
  };

  const handleLogoPick = (media: { url: string } | { url: string }[]) => {
    const selected = Array.isArray(media) ? media[0] : media;
    if (!logoTarget) return;
    if (logoTarget.scope === 'new') {
      if (logoTarget.variant === 'light') {
        setNewCompany(prev => ({ ...prev, logo: selected.url }));
      } else {
        setNewCompany(prev => ({ ...prev, darkLogo: selected.url }));
      }
    } else {
      setCompanies(prev => prev.map(c => {
        if (c.id === logoTarget.id) {
          if (logoTarget.variant === 'light') return { ...c, logo: selected.url };
          return { ...c, darkLogo: selected.url };
        }
        return c;
      }));
    }
    setIsMediaPickerOpen(false);
    setLogoTarget(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Companies Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the companies displayed on the homepage
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Company */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Company</CardTitle>
          <CardDescription>
            Create a new company to display on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newName">Company Name</Label>
              <Input
                id="newName"
                className="dark:bg-background border-footer-border/50"
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Apple"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newLogo">Light Logo URL</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setLogoTarget({ scope: 'new', variant: 'light' }); setIsMediaPickerOpen(true); }}
                  className="dark:bg-background border-footer-border/50 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-1" /> Upload
                </Button>
              </div>
              <Input
                id="newLogo"
                className="dark:bg-background border-footer-border/50"
                value={newCompany.logo}
                onChange={(e) =>
                  setNewCompany((prev) => ({ ...prev, logo: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newDarkLogo">Dark Logo URL (optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setLogoTarget({ scope: 'new', variant: 'dark' }); setIsMediaPickerOpen(true); }}
                  className="dark:bg-background border-footer-border/50 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-1" /> Upload
                </Button>
              </div>
              <Input
                id="newDarkLogo"
                className="dark:bg-background border-footer-border/50"
                value={newCompany.darkLogo || ''}
                onChange={(e) =>
                  setNewCompany((prev) => ({ ...prev, darkLogo: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>
          <Button
            onClick={addCompany}
            className=' dark:text-white'
            disabled={!newCompany.name || !newCompany.logo || isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Company"}
          </Button>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Companies ({companies.length})
        </h2>
        {companies.map((company, index) => (
          <Card key={company.id || `company-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{company.order + 1}</Badge> */}
                    <div className="w-10 h-10 rounded flex items-center justify-center overflow-hidden">
                      {company.logo ? (
                        <>
                          {/* Light mode logo */}
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain block dark:hidden"
                          />
                          {/* Dark mode logo (fallback to light if not set) */}
                          <img
                            src={company.darkLogo || company.logo}
                            alt={company.name}
                            className="w-full h-full object-contain hidden dark:block"
                          />
                        </>
                      ) : (
                        <Building2 className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={company.name}
                      className="dark:bg-background border-footer-border/50"
                      onChange={(e) =>
                        updateCompany(company.id!, "name", e.target.value)
                      }
                      placeholder="Apple"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Light Logo URL</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => { setLogoTarget({ scope: 'existing', variant: 'light', id: company.id! }); setIsMediaPickerOpen(true); }} className="dark:bg-background border-footer-border/50 cursor-pointer">
                        <Upload className="h-4 w-4 mr-1" /> Upload
                      </Button>
                    </div>
                    <Input
                      value={company.logo}
                      className="dark:bg-background border-footer-border/50"
                      onChange={(e) =>
                        updateCompany(company.id!, "logo", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Dark Logo URL (optional)</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => { setLogoTarget({ scope: 'existing', variant: 'dark', id: company.id! }); setIsMediaPickerOpen(true); }} className="dark:bg-background border-footer-border/50 cursor-pointer">
                        <Upload className="h-4 w-4 mr-1" /> Upload
                      </Button>
                    </div>
                    <Input
                      value={company.darkLogo || ''}
                      className="dark:bg-background border-footer-border/50"
                      onChange={(e) =>
                        updateCompany(company.id!, "darkLogo", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => askDeleteCompany(company)}
                    className="dark:bg-background border-footer-border/50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {companies.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500 dark:text-foreground/50">
                <p>No companies added yet.</p>
                <p className="text-sm">Add your first company above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete company</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {companyToDelete ? (
              <p>
                Are you sure you want to delete <strong>{companyToDelete.name}</strong>? This action cannot be undone.
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCompany}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleLogoPick}
      />
    </div>
  );
}
