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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  X,
  Save,
  Trash2,
  GripVertical,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id?: number;
  title: string;
  description: string;
  iconType: "email" | "phone" | "linkedin" | "location";
  isLink: boolean;
  href?: string;
  order: number;
}

const contactTypes = [
  {
    type: "email",
    label: "Email Address",
    icon: Mail,
    placeholder: "bekurtechnologies@gmail.com",
    titlePlaceholder: "Email Address",
  },
  {
    type: "phone",
    label: "Phone Number",
    icon: Phone,
    placeholder: "+251-912345678",
    titlePlaceholder: "Phone Number",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://www.linkedin.com/company/bekur-technologies/",
    titlePlaceholder: "LinkedIn",
    isLink: true,
  },
  {
    type: "location",
    label: "Office Location",
    icon: MapPin,
    placeholder: "Sebara Babur, Addis Abeba, Ethiopia",
    titlePlaceholder: "Office Location",
  },
];

export default function ContactEditor() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/admin/contact");
      if (response.ok) {
        const data = await response.json();
        setContacts(data.sort((a: Contact, b: Contact) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contact information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contacts),
      });

      if (response.ok) {
        toast.success("Contact information saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving contacts:", error);
      toast.error("Failed to save contact information");
    } finally {
      setIsSaving(false);
    }
  };

  const getContactByType = (type: string) => {
    return contacts.find((contact) => contact.iconType === type);
  };

  const updateContactByType = (
    type: string,
    field: keyof Contact,
    value: string | number | boolean
  ) => {
    setContacts((prev) => {
      const existingContact = prev.find((contact) => contact.iconType === type);
      if (existingContact) {
        return prev.map((contact) =>
          contact.iconType === type ? { ...contact, [field]: value } : contact
        );
      } else {
        // Create new contact if it doesn't exist
        const contactType = contactTypes.find((ct) => ct.type === type);
        const newContact: Contact = {
          title: contactType?.titlePlaceholder || "",
          description: "",
          iconType: type as "email" | "phone" | "linkedin" | "location",
          isLink: contactType?.isLink || false,
          href: contactType?.isLink ? "" : undefined,
          order: prev.length,
          [field]: value,
        };
        return [...prev, newContact];
      }
    });
  };

  const getIconComponent = (iconType: string) => {
    const contactType = contactTypes.find((ct) => ct.type === iconType);
    return contactType ? contactType.icon : Mail;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">
            Contact Information Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the contact information displayed on the contact section
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactTypes.map((contactType) => {
          const contact = getContactByType(contactType.type);
          const IconComponent = contactType.icon;

          return (
            <Card key={contactType.type}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {contactType.label}
                    </CardTitle>
                    <CardDescription>
                      {contact ? "Configured" : "Not configured"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor={`${contactType.type}-title`}>Title</Label>
                  <Input
                    id={`${contactType.type}-title`}
                    className="dark:bg-background border-footer-border/50"
                    value={contact?.title || contactType.titlePlaceholder}
                    onChange={(e) =>
                      updateContactByType(
                        contactType.type,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder={contactType.titlePlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${contactType.type}-description`}>
                    Value
                  </Label>
                  <Input
                    id={`${contactType.type}-description`}
                    className="dark:bg-background border-footer-border/50"
                    value={contact?.description || ""}
                    onChange={(e) =>
                      updateContactByType(
                        contactType.type,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder={contactType.placeholder}
                    type={contactType.type === "email" ? "email" : "text"}
                  />
                </div>

                {contactType.isLink && (
                  <div className="space-y-2">
                    <Label htmlFor={`${contactType.type}-href`}>Link URL</Label>
                    <Input
                      id={`${contactType.type}-href`}
                      className="dark:bg-background border-footer-border/50"
                      value={contact?.href || ""}
                      onChange={(e) =>
                        updateContactByType(
                          contactType.type,
                          "href",
                          e.target.value
                        )
                      }
                      placeholder={contactType.placeholder}
                      type="url"
                    />
                  </div>
                )}

                {contact && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={contact.isLink}
                        onCheckedChange={(checked) =>
                          updateContactByType(
                            contactType.type,
                            "isLink",
                            checked
                          )
                        }
                      />
                      <Label className="text-sm">Is Link</Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:!bg-background"
                      onClick={() => {
                        setContacts((prev) =>
                          prev.filter((c) => c.iconType !== contactType.type)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            This is how the contact information will appear on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:flex md:flex-col gap-6 md:gap-8 max-w-md">
            {contacts.map((contact, index) => {
              const contactType = contactTypes.find(
                (ct) => ct.type === contact.iconType
              );
              const IconComponent = contactType?.icon || Mail;

              return (
                <div
                  key={`${contact.id}-${index}`}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {contact.title}
                    </h4>
                    {contact.isLink ? (
                      <a
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 underline hover:text-primary transition-colors"
                      >
                        {contact.description}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {contact.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {contacts.length === 0 && (
              <div className="text-center text-gray-500 dark:text-foreground/50 col-span-2">
                <p>No contact information configured yet.</p>
                <p className="text-sm">
                  Configure the contact types above to see them here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
