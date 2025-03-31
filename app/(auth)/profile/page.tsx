"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Calendar,
  CreditCard,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Pencil,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiEndpoint, imageEndpoint } from "@/helper/api";
import { isApiError } from "@/types";
import { toast } from "sonner";
import Store from "@/helper/store";
import Link from "next/link";

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

// Define an interface for the address components
interface AddressComponents {
  buildingNo: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Address fields state
  const [addressComponents, setAddressComponents] = useState<AddressComponents>(
    {
      buildingNo: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { checkLogin } = Store.useAuth();
  const router = useRouter();

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

        // Split address into components if it exists
        if (data.user.address) {
          const addressParts = parseAddressString(data.user.address);
          setAddressComponents(addressParts);
        }

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

  // Parse address string into components
  const parseAddressString = (addressString: string): AddressComponents => {
    // Try to parse the address string - this is a basic implementation
    // In a real app, you might need a more robust approach
    const parts = addressString.split(",").map((part) => part.trim());

    return {
      buildingNo: parts[0] || "",
      locality: parts[1] || "",
      city: parts[2] || "",
      state: parts[3] || "",
      pincode: parts[4] || "",
    };
  };

  // Combine address components into a single string
  const combineAddressComponents = (): string => {
    const { buildingNo, locality, city, state, pincode } = addressComponents;
    return [buildingNo, locality, city, state, pincode]
      .filter((part) => part.trim() !== "")
      .join(", ");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressComponents((prev) => ({ ...prev, [name]: value }));
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

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await fetch(`${apiEndpoint}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (isApiError(err)) {
        toast.error(err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setPasswordLoading(false);
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
          if (key === "address") {
            // Combine address components into a single string
            const combinedAddress = combineAddressComponents();
            formData.append(key, combinedAddress);
          } else {
            formData.append(key, value);
          }
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
    if (profile?.address) {
      const addressParts = parseAddressString(profile.address);
      setAddressComponents(addressParts);
    }
    setSelectedImage(null);
    if (profile?.profileImage) {
      setImagePreview(`${imageEndpoint}${profile.profileImage}`);
    }
    setIsEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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
    <div className="mx-auto px-4 py-12">
      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="relative p-0">
              <div className="h-48 bg-gradient-to-r from-primaryBlue to-primaryBlue/80 rounded-t-lg"></div>
              <div className="absolute -bottom-16 left-8 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
                <div className="relative w-32 h-32 bg-gray-200 rounded-full">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={profile.fullname}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt={profile.fullname}
                      fill
                      className="object-cover"
                    />
                  )}
                  <button
                    onClick={handleImageClick}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-20 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{profile.fullname}</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {profile.role}
                  </p>
                </div>
                {isEditing ? (
                  <div className="space-x-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-primaryBlue hover:bg-primaryBlue/90"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-primaryOrange hover:bg-primaryOrange/90"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      Email
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          name="email"
                          value={editableProfile?.email || ""}
                          readOnly
                          className="pl-10 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-primaryOrange" />
                        <p>{profile.email}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          name="contact"
                          value={editableProfile?.contact || ""}
                          readOnly
                          className="pl-10 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-primaryOrange" />
                        <p>{profile.contact || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      Date of Birth
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          name="dateOfBirth"
                          type="date"
                          value={editableProfile?.dateOfBirth || ""}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-primaryOrange" />
                        <p>{profile.dateOfBirth || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      Aadhar Card
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          name="aadharCard"
                          value={editableProfile?.aadharCard || ""}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-4 w-4 text-primaryOrange" />
                        <p>{profile.aadharCard || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      PAN Card
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          name="panCard"
                          value={editableProfile?.panCard || ""}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <CreditCard className="h-4 w-4 text-primaryOrange" />
                        <p>{profile.panCard || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      Address
                    </Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            name="buildingNo"
                            placeholder="Building No. / House No."
                            value={addressComponents.buildingNo}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="relative">
                          <Input
                            name="locality"
                            placeholder="Locality / Area"
                            value={addressComponents.locality}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="relative">
                          <Input
                            name="city"
                            placeholder="City"
                            value={addressComponents.city}
                            onChange={handleAddressChange}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            name="state"
                            placeholder="State"
                            value={addressComponents.state}
                            onChange={handleAddressChange}
                          />
                          <Input
                            name="pincode"
                            placeholder="Pincode"
                            value={addressComponents.pincode}
                            onChange={handleAddressChange}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-primaryOrange mt-1" />
                        <p>{profile.address || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="twoFactor" disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive alerts when someone logs into your account
                    </p>
                  </div>
                  <Switch id="loginNotifications" defaultChecked disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Remember Devices</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay logged in on trusted devices
                    </p>
                  </div>
                  <Switch id="rememberDevices" defaultChecked disabled />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-primaryBlue hover:bg-primaryBlue/90"
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notification and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive updates about your bookings and promotions
                    </p>
                  </div>
                  <Switch disabled id="emailNotifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive text messages for important updates
                    </p>
                  </div>
                  <Switch disabled id="smsNotifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Communications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive promotional offers and updates
                    </p>
                  </div>
                  <Switch disabled id="marketingCommunications" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Display Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <Switch disabled id="darkMode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">High Contrast</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch disabled id="highContrast" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Reduced Motion</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch disabled id="reducedMotion" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Language and Region</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="w-full p-2 border rounded-md"
                      disabled
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <select
                      id="region"
                      className="w-full p-2 border rounded-md"
                      disabled
                    >
                      <option value="in">India</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                    </select>
                  </div>
                  <Button
                    className="bg-primaryBlue hover:bg-primaryBlue/90"
                    disabled
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primaryOrange" />
            <h2 className="text-xl font-bold">Need Help?</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you need assistance with your account or have any questions, our
            support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={
                profile?.role === "Client"
                  ? "/client/support"
                  : "/partner/support"
              }
            >
              <Button variant="outline">Contact Support</Button>
            </Link>
            <Link href={"/faqs"}>
              <Button variant="outline">FAQs</Button>
            </Link>
            <Link href={"/terms-conditions"}>
              <Button variant="outline">Terms & Conditions</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
