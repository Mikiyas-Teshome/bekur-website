"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Star,
  Settings,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: number;
  title: string;
  description: string;
  iconKey: string;
  order: number;
}

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  order: number;
  serviceId?: number;
  service?: Service;
  originalPrice?: string;
  discount?: string;
  targetAudience?: string;
  buttonText?: string;
  pricingType: "simple" | "platform_based";
  platform?:
    | "facebook"
    | "linkedin"
    | "tiktok"
    | "instagram"
    | "twitter"
    | "youtube"
    | "google"
    | "general";
  subtitle?: string;
  createdAt: string;
  updatedAt: string;
}

const PRICING_TYPES = [
  { value: "simple", label: "Simple Pricing", icon: Settings },
  { value: "platform_based", label: "Platform-based Pricing", icon: Monitor },
];

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "google", label: "Google" },
  { value: "general", label: "General" },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PricingPlan>>({
    name: "",
    price: "",
    features: [],
    highlight: false,
    serviceId: undefined,
    originalPrice: "",
    discount: "",
    targetAudience: "",
    buttonText: "Get Started",
    pricingType: "simple",
    platform: "general",
    subtitle: "",
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPlans();
    fetchServices();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/pricing");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast.error("Failed to load pricing plans");
      }
    } catch {
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      price: "",
      features: [],
      highlight: false,
      serviceId: undefined,
      originalPrice: "",
      discount: "",
      targetAudience: "",
      buttonText: "Get Started",
      pricingType: "simple",
      platform: "general",
      subtitle: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingPlan
        ? `/api/admin/pricing/${editingPlan.id}`
        : "/api/admin/pricing";
      const method = editingPlan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedPlan = await response.json();
        if (editingPlan) {
          setPlans((prev) =>
            prev.map((p) => (p.id === editingPlan.id ? savedPlan : p))
          );
        } else {
          setPlans((prev) => [...prev, savedPlan]);
        }
        setIsDialogOpen(false);
        toast.success(`Pricing plan ${editingPlan ? "updated" : "created"}`);
      } else {
        toast.error("Failed to save pricing plan");
      }
    } catch {
      toast.error("Failed to save pricing plan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;

    try {
      const response = await fetch(`/api/admin/pricing/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
        toast.success("Pricing plan deleted");
      } else {
        toast.error("Failed to delete pricing plan");
      }
    } catch {
      toast.error("Failed to delete pricing plan");
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleToggleHighlight = (id: number) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? { ...plan, highlight: !plan.highlight }
          : { ...plan, highlight: false }
      )
    );
  };

  const getServiceName = (serviceId?: number) => {
    if (!serviceId) return "No Service";
    const service = services.find((s) => s.id === serviceId);
    return service?.title || "Unknown Service";
  };

  const getPlatformLabel = (platform?: string) => {
    if (!platform) return "General";
    const platformObj = PLATFORMS.find((p) => p.value === platform);
    return platformObj?.label || platform;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground dark:text-foreground/80">
            Manage your pricing plans and packages
          </p>
        </div>
        <Button onClick={handleCreate} className=" dark:text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </div>

      {/* Pricing plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.highlight ? "ring-2 ring-primary" : ""
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.highlight}
                    onCheckedChange={() => handleToggleHighlight(plan.id)}
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
              </div>
              {plan.subtitle && (
                <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {
                    PRICING_TYPES.find((t) => t.value === plan.pricingType)
                      ?.label
                  }
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getServiceName(plan.serviceId)}
                </Badge>
                {plan.pricingType === "platform_based" && (
                  <Badge variant="outline" className="text-xs">
                    {getPlatformLabel(plan.platform)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(plan)}
                  className="flex-1 dark:!bg-foreground dark:text-background"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 hover:text-red-700 dark:!bg-foreground"
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-background border border-border p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingPlan ? "Edit Pricing Plan" : "Create Pricing Plan"}
            </h3>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className=" space-y-3">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    value={formData.serviceId?.toString() || "none"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        serviceId:
                          value === "none" ? undefined : parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Service</SelectItem>
                      {services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className=" space-y-3">
                  <Label htmlFor="name">Plan Name</Label>
                  <Select
                    value={formData.name || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, name: value }))
                    }
                  >
                    <SelectTrigger className="dark:bg-background border-footer-border/50">
                      <SelectValue placeholder="Select plan name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=" space-y-3">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  className="dark:bg-background border-footer-border/50"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              {/* Pricing Type */}
              <div>
                <Label>Pricing Type</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {PRICING_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors border-footer-border/50 ${
                          formData.pricingType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-border/80"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            pricingType: type.value as
                              | "simple"
                              | "platform_based",
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Selection (only for platform-based pricing) */}
              {formData.pricingType === "platform_based" && (
                <div className=" space-y-3">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform || "general"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        platform: value as
                          | "facebook"
                          | "linkedin"
                          | "tiktok"
                          | "instagram"
                          | "twitter"
                          | "youtube"
                          | "google"
                          | "general",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Additional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className=" space-y-3">
                  <Label htmlFor="originalPrice">
                    Original Price (Optional)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    className="dark:bg-background border-footer-border/50"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: e.target.value,
                      }))
                    }
                    placeholder="Original price for discount display"
                  />
                </div>
                <div className=" space-y-3">
                  <Label htmlFor="discount">Discount (Optional)</Label>
                  <Input
                    id="discount"
                    className="dark:bg-background border-footer-border/50"
                    value={formData.discount || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount: e.target.value,
                      }))
                    }
                    placeholder="e.g., 20% OFF"
                  />
                </div>
              </div>

              <div className=" space-y-3">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Brief subtitle for the plan"
                />
              </div>

              <div className=" space-y-3">
                <Label htmlFor="targetAudience">
                  Target Audience (Optional)
                </Label>
                <Input
                  id="targetAudience"
                  className="dark:bg-background border-footer-border/50"
                  value={formData.targetAudience || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                  placeholder="e.g., Small businesses, Enterprise"
                />
              </div>

              <div className=" space-y-3">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  className="dark:bg-background border-footer-border/50"
                  value={formData.buttonText || "Get Started"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buttonText: e.target.value,
                    }))
                  }
                  placeholder="Get Started"
                />
              </div>

              {/* Features */}
              <div className=" space-y-3">
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      className="dark:bg-background border-footer-border/50"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddFeature()
                      }
                    />
                    <Button onClick={handleAddFeature} className=" dark:text-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.features?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted p-2 rounded"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Plan Toggle */}
              <div className="flex items-center gap-2 space-y-3">
                <Switch
                  checked={formData.highlight || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, highlight: checked }))
                  }
                />
                <Label>Mark as Popular Plan</Label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave} className=" dark:text-white">
                {editingPlan ? "Update" : "Create"} Plan
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
