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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, Trash2, GripVertical, Heart } from "lucide-react";
import { toast } from "sonner";

interface Value {
  id?: number;
  title: string;
  description: string;
  step: string;
  iconKey: string;
  order: number;
}

const iconOptions = [
  "Users",
  "Lightbulb",
  "Handshake",
  "Shield",
  "Heart",
  "Star",
  "Target",
  "Zap",
  "CheckCircle",
  "TrendingUp",
];

export default function ValuesEditor() {
  const [values, setValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState<Omit<Value, "id">>({
    title: "",
    description: "",
    step: "",
    iconKey: "",
    order: 0,
  });

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      const response = await fetch("/api/admin/values");
      if (response.ok) {
        const data = await response.json();
        setValues(data.sort((a: Value, b: Value) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching values:", error);
      toast.error("Failed to load values");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/values", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Values saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving values:", error);
      toast.error("Failed to save values");
    } finally {
      setIsSaving(false);
    }
  };

  const addValue = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new values
      const maxId =
        values.length > 0 ? Math.max(...values.map((v) => v.id || 0)) : 0;
      const value: Value = {
        ...newValue,
        id: maxId + 1,
        order: values.length,
      };
      const updatedValues = [...values, value];
      setValues(updatedValues);
      setNewValue({
        title: "",
        description: "",
        step: "",
        iconKey: "",
        order: 0,
      });

      // Automatically save to database
      const response = await fetch("/api/admin/values", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      if (response.ok) {
        toast.success("Value added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving values:", error);
      toast.error("Failed to save value");
      // Revert the local state if save failed
      setValues(values);
    } finally {
      setIsAdding(false);
    }
  };

  const updateValue = (
    id: number,
    field: keyof Value,
    value: string | number
  ) => {
    setValues((prev) =>
      prev.map((val) => (val.id === id ? { ...val, [field]: value } : val))
    );
  };

  const deleteValue = (id: number) => {
    setValues((prev) => prev.filter((val) => val.id !== id));
  };

  const moveValue = (fromIndex: number, toIndex: number) => {
    const newValues = [...values];
    const [movedValue] = newValues.splice(fromIndex, 1);
    newValues.splice(toIndex, 0, movedValue);

    // Update order values
    const updatedValues = newValues.map((val, index) => ({
      ...val,
      order: index,
    }));

    setValues(updatedValues);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading values...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Values Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the company values displayed on the about page
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Value */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Value</CardTitle>
          <CardDescription>
            Create a new company value to display on the about page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                className="dark:bg-background border-footer-border/50"
                value={newValue.title}
                onChange={(e) =>
                  setNewValue((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="User-Centered Design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newStep">Step Number</Label>
              <Input
                id="newStep"
                className="dark:bg-background border-footer-border/50"
                value={newValue.step}
                onChange={(e) =>
                  setNewValue((prev) => ({ ...prev, step: e.target.value }))
                }
                placeholder="01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newIcon">Icon Key</Label>
              <Select
                value={newValue.iconKey}
                onValueChange={(value) =>
                  setNewValue((prev) => ({ ...prev, iconKey: value }))
                }
              >
                <SelectTrigger className="dark:bg-background border-footer-border/50">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDescription">Description</Label>
              <Textarea
                id="newDescription"
                className="dark:bg-background border-footer-border/50"
                value={newValue.description}
                onChange={(e) =>
                  setNewValue((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="We Put The Heart Of Everything—Every Product Starts With Empathy."
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={addValue}
            className=' dark:text-white'
            disabled={
              !newValue.title ||
              !newValue.description ||
              !newValue.step ||
              !newValue.iconKey ||
              isAdding
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Value"}
          </Button>
        </CardContent>
      </Card>

      {/* Values List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Values ({values.length})</h2>
        {values.map((value, index) => (
          <Card key={`value-${value.id || index}-${value.title}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{value.order + 1}</Badge> */}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Title</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={value.title}
                        onChange={(e) =>
                          updateValue(value.id!, "title", e.target.value)
                        }
                        placeholder="User-Centered Design"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Step Number</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={value.step}
                        onChange={(e) =>
                          updateValue(value.id!, "step", e.target.value)
                        }
                        placeholder="01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Icon Key</Label>
                      <Select
                        value={value.iconKey}
                        onValueChange={(selectedValue) =>
                          updateValue(value.id!, "iconKey", selectedValue)
                        }
                      >
                        <SelectTrigger className="dark:bg-background border-footer-border/50">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Description</Label>
                      <Textarea
                        className="dark:bg-background border-footer-border/50"
                        value={value.description}
                        onChange={(e) =>
                          updateValue(value.id!, "description", e.target.value)
                        }
                        placeholder="We Put The Heart Of Everything—Every Product Starts With Empathy."
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
                    onClick={() => deleteValue(value.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {values.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500 dark:text-foreground/50">
                <p>No values added yet.</p>
                <p className="text-sm">Add your first value above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
