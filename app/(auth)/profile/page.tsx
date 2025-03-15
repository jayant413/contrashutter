"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiEndpoint, imageEndpoint } from "@/helper/api";
import { isApiError } from "@/types";
import Image from "next/image";
import { toast } from "sonner";
import Store from "@/helper/store";

// Define an enum for roles
enum Role {
  Client = "Client",
  ServiceProvider = "Service Provider",
}

// Define the user profile interface with role as enum
interface UserProfile {
  fullname: string;
  email: string;
  contact?: string;
  role: Role;
  dateOfBirth?: string;
  aadharCard?: string;
  panCard?: string;
  address?: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { checkLogin } = Store.useAuth();

  // Fetch the user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiEndpoint}/user/checkLogin`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data.user);
        setEditableProfile(data.user);
        if (data.user.profileImage) {
          setImagePreview(`${imageEndpoint}${data.user.profileImage}`);
        }
      } catch (err) {
        if (isApiError(err)) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!editableProfile) return;

    try {
      setLoading(true);
      const formData = new FormData();

      // Append all profile fields
      Object.entries(editableProfile).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append image if selected
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const response = await fetch(`${apiEndpoint}/user/updateProfile`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.user);
      setEditableProfile(data.user);
      if (data.user.profileImage) {
        setImagePreview(`${imageEndpoint}${data.user.profileImage}`);
        checkLogin();
      }
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      if (isApiError(err)) {
        setError(err.message);
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditableProfile(profile);
    setSelectedImage(null);
    if (profile?.profileImage) {
      setImagePreview(`${imageEndpoint}${profile.profileImage}`);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-primaryBlue to-blue-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      // src={profile.profileImage}
                      src="https://github.com/shadcn.png"
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    // <div className="w-full h-full flex items-center justify-center text-gray-400">
                    //   <svg
                    //     className="w-16 h-16"
                    //     fill="none"
                    //     stroke="currentColor"
                    //     viewBox="0 0 24 24"
                    //   >
                    //     <path
                    //       strokeLinecap="round"
                    //       strokeLinejoin="round"
                    //       strokeWidth={2}
                    //       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    //     />
                    //   </svg>
                    // </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.fullname}
                </h1>
                <p className="text-gray-600">{profile.role}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      name="fullname"
                      value={editableProfile?.fullname || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      value={editableProfile?.email || ""}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 ">
                      Phone Number
                    </label>
                    <Input
                      name="contact"
                      readOnly
                      value={editableProfile?.contact || ""}
                      onChange={handleInputChange}
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={editableProfile?.dateOfBirth || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Card
                    </label>
                    <Input
                      name="aadharCard"
                      value={editableProfile?.aadharCard || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Card
                    </label>
                    <Input
                      name="panCard"
                      value={editableProfile?.panCard || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Textarea
                      name="address"
                      value={editableProfile?.address || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Phone Number
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.contact || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.dateOfBirth || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Aadhar Card
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.aadharCard || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      PAN Card
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.panCard || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Address
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {isEditing ? (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} variant="primaryBlue">
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primaryBlue"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
