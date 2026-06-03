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
import { Plus, X, Save, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface Service {
  id?: number;
  number: string;
  title: string;
  description: string;
  iconKey: string;
  order: number;
  steps: Array<{
    title: string;
    description: string;
    iconKey: string;
  }>;
}

const iconOptions = [
  "Outsource",
  "DigitalMarketing",
  "SocialMediaManagement",
  "WebDevelopment",
  "AppDevelopment",
  "UiUxDevelopment",
  "Branding",
  "SEO",
  "Email",
  "Phone",
  "Location",
  "Users",
  "Shield",
  "Lightbulb",
  "Handshake",
];

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    number: "",
    title: "",
    description: "",
    iconKey: "",
    order: 0,
    steps: [],
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.sort((a: Service, b: Service) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(services),
      });

      if (response.ok) {
        toast.success("Services saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving services:", error);
      toast.error("Failed to save services");
    } finally {
      setIsSaving(false);
    }
  };

  const addService = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new services
      const maxId =
        services.length > 0 ? Math.max(...services.map((s) => s.id || 0)) : 0;
      const service: Service = {
        ...newService,
        id: maxId + 1,
        order: services.length,
      };
      const updatedServices = [...services, service];
      setServices(updatedServices);
      setNewService({
        number: "",
        title: "",
        description: "",
        iconKey: "",
        order: 0,
        steps: [],
      });

      // Automatically save to database
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedServices),
      });

      if (response.ok) {
        toast.success("Service added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving services:", error);
      toast.error("Failed to save service");
      // Revert the local state if save failed
      setServices(services);
    } finally {
      setIsAdding(false);
    }
  };

  const updateService = (
    id: number,
    field: keyof Service,
    value: string | number
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete?.id) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/services?id=${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('Service deleted successfully');
        // Refresh the services list from the database
        await fetchServices();
      } else {
        console.error('Delete failed:', data);
        toast.error(data.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const moveService = (fromIndex: number, toIndex: number) => {
    const newServices = [...services];
    const [movedService] = newServices.splice(fromIndex, 1);
    newServices.splice(toIndex, 0, movedService);

    // Update order values
    const updatedServices = newServices.map((service, index) => ({
      ...service,
      order: index,
    }));

    setServices(updatedServices);
  };

  const addServiceStep = (serviceId: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              steps: [
                ...service.steps,
                { title: "", description: "", iconKey: "" },
              ],
            }
          : service
      )
    );
  };

  const updateServiceStep = (
    serviceId: number,
    stepIndex: number,
    field: string,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              steps: service.steps.map((step, index) =>
                index === stepIndex ? { ...step, [field]: value } : step
              ),
            }
          : service
      )
    );
  };

  const deleteServiceStep = (serviceId: number, stepIndex: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              steps: service.steps.filter((_, index) => index !== stepIndex),
            }
          : service
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the services displayed on the homepage
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Service */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Service</CardTitle>
          <CardDescription>
            Create a new service to display on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newNumber">Number</Label>
              <Input
                id="newNumber"
                className="dark:bg-background border-footer-border/50"
                value={newService.number}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, number: e.target.value }))
                }
                placeholder="01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                className="dark:bg-background border-footer-border/50"
                value={newService.title}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Service title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newIcon">Icon Key</Label>
              <Select
                value={newService.iconKey}
                onValueChange={(value) =>
                  setNewService((prev) => ({ ...prev, iconKey: value }))
                }
              >
                <SelectTrigger className="dark:bg-background border-footer-border/50">
                  <SelectValue className="dark:text-foreground" placeholder="Select an icon" />
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
                value={newService.description}
                className="dark:bg-background border-footer-border/50"
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Service description"
                rows={3}
              />
            </div>
          </div>
          <Button
            onClick={addService}
            className=' dark:text-white'
            disabled={
              !newService.number ||
              !newService.title ||
              !newService.description ||
              !newService.iconKey ||
              isAdding
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Service"}
          </Button>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Services ({services.length})</h2>
        {services.map((service, index) => (
          <Card key={service.id || index}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{service.order + 1}</Badge> */}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number</Label>
                      <Input
                        value={service.number}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateService(service.id!, "number", e.target.value)
                        }
                        placeholder="01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={service.title}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateService(service.id!, "title", e.target.value)
                        }
                        placeholder="Service title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon Key</Label>
                      <Select
                        value={service.iconKey}
                        onValueChange={(value) =>
                          updateService(service.id!, "iconKey", value)
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
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateService(
                            service.id!,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Service description"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Service Steps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Service Steps ({service.steps?.length || 0})
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addServiceStep(service.id!)}
                        className="dark:bg-background border-footer-border/50 cursor-pointer"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Step
                      </Button>
                    </div>

                    {service.steps?.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="border rounded-lg p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            Step {stepIndex + 1}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              deleteServiceStep(service.id!, stepIndex)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Step Title</Label>
                            <Input
                              value={step.title}
                              onChange={(e) =>
                                updateServiceStep(
                                  service.id!,
                                  stepIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Step title"
                              size={1}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Step Icon</Label>
                            <Select
                              value={step.iconKey}
                              onValueChange={(value) =>
                                updateServiceStep(
                                  service.id!,
                                  stepIndex,
                                  "iconKey",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="dark:bg-background border-footer-border/50">
                                <SelectValue placeholder="Select icon" />
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
                          <div className="space-y-1">
                            <Label className="text-xs">Step Description</Label>
                            <Textarea
                              value={step.description}
                              className="dark:bg-background border-footer-border/50"
                              onChange={(e) =>
                                updateServiceStep(
                                  service.id!,
                                  stepIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Step description"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!service.steps || service.steps.length === 0) && (
                      <div className="text-center text-gray-500 py-4 border-2 border-dashed rounded-lg">
                        <p className="text-sm">No steps added yet.</p>
                        <p className="text-xs">
                          Click &quot;Add Step&quot; to add service steps.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(service)}
                      className="text-red-600 hover:text-red-700 dark:bg-background border-footer-border/50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {services.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No services added yet.</p>
                <p className="text-sm">Add your first service above.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
