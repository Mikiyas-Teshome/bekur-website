"use client";

import { useState, useEffect } from "react";
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
import { Plus, X, Save, Edit, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Feature {
  id?: number;
  title: string;
  description: string;
  order: number;
}

export default function FeaturesEditor() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState<Omit<Feature, "id">>({
    title: "",
    description: "",
    order: 0,
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/admin/features");
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.sort((a: Feature, b: Feature) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to load features");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/features", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      });

      if (response.ok) {
        toast.success("Features saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving features:", error);
      toast.error("Failed to save features");
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new features
      const maxId =
        features.length > 0 ? Math.max(...features.map((f) => f.id || 0)) : 0;
      const feature: Feature = {
        ...newFeature,
        id: maxId + 1,
        order: features.length,
      };
      const updatedFeatures = [...features, feature];
      setFeatures(updatedFeatures);
      setNewFeature({ title: "", description: "", order: 0 });

      // Automatically save to database
      const response = await fetch("/api/admin/features", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFeatures),
      });

      if (response.ok) {
        toast.success("Feature added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving features:", error);
      toast.error("Failed to save feature");
      // Revert the local state if save failed
      setFeatures(features);
    } finally {
      setIsAdding(false);
    }
  };

  const updateFeature = (
    id: number,
    field: keyof Feature,
    value: string | number
  ) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const deleteFeature = (id: number) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  };

  const moveFeature = (fromIndex: number, toIndex: number) => {
    const newFeatures = [...features];
    const [movedFeature] = newFeatures.splice(fromIndex, 1);
    newFeatures.splice(toIndex, 0, movedFeature);

    // Update order values
    const updatedFeatures = newFeatures.map((feature, index) => ({
      ...feature,
      order: index,
    }));

    setFeatures(updatedFeatures);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Features Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the features displayed on the homepage
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Feature */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Feature</CardTitle>
          <CardDescription>
            Create a new feature to display on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                className="dark:bg-background border-footer-border/50"
                value={newFeature.title}
                onChange={(e) =>
                  setNewFeature((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Feature title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDescription">Description</Label>
              <Textarea
                id="newDescription"
                value={newFeature.description}
                className="dark:bg-background border-footer-border/50"
                onChange={(e) =>
                  setNewFeature((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Feature description"
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={addFeature}
            className=' dark:text-white'
            disabled={!newFeature.title || !newFeature.description || isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Feature"}
          </Button>
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Features ({features.length})</h2>
        {features.map((feature, index) => (
          <Card key={feature.id || `feature-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{feature.order + 1}</Badge> */}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateFeature(feature.id!, "title", e.target.value)
                        }
                        placeholder="Feature title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateFeature(
                            feature.id!,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Feature description"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:bg-background border-footer-border/50 cursor-pointer"
                      onClick={() => deleteFeature(feature.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600 hover:text-red-700 dark:bg-background border-footer-border/50 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {features.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No features added yet.</p>
                <p className="text-sm">Add your first feature above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
