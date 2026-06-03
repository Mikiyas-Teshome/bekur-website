"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Plus, Save, Trash2, GripVertical, User, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadImageFile, validateImageFile } from "@/lib/image-upload";

interface TeamMember {
  id?: number;
  profileImage: string;
  name: string;
  title: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  order: number;
}

export default function TeamEditor() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const [uploadingMembers, setUploadingMembers] = useState<Set<number>>(
    new Set()
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Refs for file inputs
  const newMemberFileInputRef = useRef<HTMLInputElement>(null);
  const memberFileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
    profileImage: "",
    name: "",
    title: "",
    socialLinks: {
      facebook: "",
      linkedin: "",
      github: "",
      email: "",
    },
    order: 0,
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/admin/team");
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(
          data.sort((a: TeamMember, b: TeamMember) => a.order - b.order)
        );
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamMembers),
      });

      if (response.ok) {
        toast.success("Team members saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving team members:", error);
      toast.error("Failed to save team members");
    } finally {
      setIsSaving(false);
    }
  };

  const addMember = async () => {
    setIsAdding(true);
    try {
      // Generate a unique ID for new members
      const maxId =
        teamMembers.length > 0
          ? Math.max(...teamMembers.map((m) => m.id || 0))
          : 0;
      const member: TeamMember = {
        ...newMember,
        id: maxId + 1,
        order: teamMembers.length,
      };

      const updatedMembers = [...teamMembers, member];
      setTeamMembers(updatedMembers);
      setNewMember({
        profileImage: "",
        name: "",
        title: "",
        socialLinks: {
          facebook: "",
          linkedin: "",
          github: "",
          email: "",
        },
        order: 0,
      });

      // Automatically save to database
      const response = await fetch("/api/admin/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMembers),
      });

      if (response.ok) {
        toast.success("Team member added and saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving team members:", error);
      toast.error("Failed to save team member");
      // Revert the local state if save failed
      setTeamMembers(teamMembers);
    } finally {
      setIsAdding(false);
    }
  };

  const updateMember = (
    id: number,
    field: keyof TeamMember,
    value: string | number | object
  ) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete?.id) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/team?id=${memberToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTeamMembers(prev => prev.filter(member => member.id !== memberToDelete.id));
        toast.success('Team member deleted successfully');
      } else {
        toast.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    } finally {
      setDeleting(false);
      setMemberToDelete(null);
    }
  };

  const moveMember = (fromIndex: number, toIndex: number) => {
    const newMembers = [...teamMembers];
    const [movedMember] = newMembers.splice(fromIndex, 1);
    newMembers.splice(toIndex, 0, movedMember);

    // Update order values
    const updatedMembers = newMembers.map((member, index) => ({
      ...member,
      order: index,
    }));

    setTeamMembers(updatedMembers);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingNew(true);
    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Upload file
      const uploadedUrl = await uploadImageFile(file);

      setNewMember((prev) => ({ ...prev, profileImage: uploadedUrl }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingNew(false);
    }
  };

  // Optimized click handlers
  const handleNewMemberFileClick = useCallback(() => {
    newMemberFileInputRef.current?.click();
  }, []);

  const handleMemberFileClick = useCallback((memberId: number) => {
    const fileInput = memberFileInputRefs.current.get(memberId);
    fileInput?.click();
  }, []);

  const handleImageUploadForMember = async (file: File, memberId: number) => {
    setUploadingMembers((prev) => new Set(prev).add(memberId));
    try {
      // Validate file
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Upload file
      const uploadedUrl = await uploadImageFile(file);

      // Update member's profile image in local state
      updateMember(memberId, "profileImage", uploadedUrl);

      // Save the updated team members to database
      const updatedMembers = teamMembers.map((member) =>
        member.id === memberId
          ? { ...member, profileImage: uploadedUrl }
          : member
      );

      const response = await fetch("/api/admin/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMembers),
      });

      if (response.ok) {
        toast.success("Image uploaded and saved successfully");
      } else {
        throw new Error("Failed to save team member");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Team Members Editor
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage the team members displayed on the homepage
          </p>
        </div>
        <Button onClick={handleSave} className=' dark:text-white' disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Add New Team Member */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Team Member</CardTitle>
          <CardDescription>
            Create a new team member to display on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="newProfileImage" className="dark:text-foreground">Profile Image</Label>
              <div className="space-y-2">
                {/* Image Preview */}
                {newMember.profileImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={newMember.profileImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center space-x-2">
                  <input
                    ref={newMemberFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                    disabled={isUploadingNew}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="dark:bg-background border-footer-border/50 cursor-pointer"
                    onClick={handleNewMemberFileClick}
                    disabled={isUploadingNew}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingNew ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>

                {/* URL Input (fallback) */}
                <div className="text-sm text-gray-500">Or enter URL:</div>
                <Input
                  id="newProfileImage"
                  className="dark:bg-background border-footer-border/50"
                  value={newMember.profileImage}
                  onChange={(e) =>
                    setNewMember((prev) => ({
                      ...prev,
                      profileImage: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newName">Name</Label>
              <Input
                id="newName"
                className="dark:bg-background border-footer-border/50"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTitle">Title</Label>
              <Input
                id="newTitle"
                className="dark:bg-background border-footer-border/50"
                value={newMember.title}
                onChange={(e) =>
                  setNewMember((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="CEO"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">Email</Label>
              <Input
                id="newEmail"
                type="email"
                className="dark:bg-background border-footer-border/50"
                value={newMember.socialLinks.email || ""}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, email: e.target.value },
                  }))
                }
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLinkedIn">LinkedIn URL</Label>
              <Input
                id="newLinkedIn"
                className="dark:bg-background border-footer-border/50"
                value={newMember.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      linkedin: e.target.value,
                    },
                  }))
                }
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newGithub">GitHub URL</Label>
              <Input
                id="newGithub"
                className="dark:bg-background border-footer-border/50"
                value={newMember.socialLinks.github || ""}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      github: e.target.value,
                    },
                  }))
                }
                placeholder="https://github.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newFacebook">Facebook URL</Label>
              <Input
                id="newFacebook"
                className="dark:bg-background border-footer-border/50"
                value={newMember.socialLinks.facebook || ""}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      facebook: e.target.value,
                    },
                  }))
                }
                placeholder="https://facebook.com/johndoe"
              />
            </div>
          </div>
          <Button
            onClick={addMember}
            className=' dark:text-white'
            disabled={!newMember.name || !newMember.title || isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add Team Member"}
          </Button>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Team Members ({teamMembers.length})
        </h2>
        {teamMembers.map((member, index) => (
          <Card key={member.id || `member-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {/* <Badge variant="outline">#{member.order + 1}</Badge> */}
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Profile Image</Label>
                      <div className="space-y-2">
                        {/* Image Preview */}
                        {member.profileImage && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={member.profileImage}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* File Input */}
                        <div className="flex items-center space-x-2">
                          <input
                            ref={(el) => {
                              if (el && member.id) {
                                memberFileInputRefs.current.set(member.id, el);
                              }
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUploadForMember(file, member.id!);
                              }
                            }}
                            className="hidden"
                            disabled={uploadingMembers.has(member.id!)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="dark:bg-background border-footer-border/50 cursor-pointer"
                            size="sm"
                            onClick={() => handleMemberFileClick(member.id!)}
                            disabled={uploadingMembers.has(member.id!)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingMembers.has(member.id!)
                              ? "Uploading..."
                              : "Upload Image"}
                          </Button>
                        </div>

                        {/* URL Input (fallback) */}
                        <div className="text-sm text-gray-500 dark:text-foreground/50">
                          Or enter URL:
                        </div>
                        <Input
                        className="dark:bg-background border-footer-border/50"
                          value={member.profileImage}
                          onChange={(e) =>
                            updateMember(
                              member.id!,
                              "profileImage",
                              e.target.value
                            )
                          }
                          placeholder="https://example.com/profile.jpg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Name</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={member.name}
                        onChange={(e) =>
                          updateMember(member.id!, "name", e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Title</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={member.title}
                        onChange={(e) =>
                          updateMember(member.id!, "title", e.target.value)
                        }
                        placeholder="CEO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-foreground">Email</Label>
                      <Input
                        type="email"
                        value={member.socialLinks.email || ""}
                        className="dark:bg-background border-footer-border/50"
                        onChange={(e) =>
                          updateMember(member.id!, "socialLinks", {
                            ...member.socialLinks,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={member.socialLinks.linkedin || ""}
                        onChange={(e) =>
                          updateMember(member.id!, "socialLinks", {
                            ...member.socialLinks,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={member.socialLinks.github || ""}
                        onChange={(e) =>
                          updateMember(member.id!, "socialLinks", {
                            ...member.socialLinks,
                            github: e.target.value,
                          })
                        }
                        placeholder="https://github.com/johndoe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook URL</Label>
                      <Input
                        className="dark:bg-background border-footer-border/50"
                        value={member.socialLinks.facebook || ""}
                        onChange={(e) =>
                          updateMember(member.id!, "socialLinks", {
                            ...member.socialLinks,
                            facebook: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/johndoe"
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(member)}
                    className="text-red-600 hover:text-red-700 dark:bg-background border-footer-border/50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {teamMembers.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No team members added yet.</p>
                <p className="text-sm">Add your first team member above.</p>
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
        title="Delete Team Member"
        description={`Are you sure you want to delete "${memberToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
