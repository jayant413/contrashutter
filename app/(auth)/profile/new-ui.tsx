// "use client";

// import type React from "react";

// import { useState, useRef } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   Camera,
//   Calendar,
//   CreditCard,
//   HelpCircle,
//   Mail,
//   MapPin,
//   Phone,
//   Save,
//   Pencil,
//   X,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import Store from "@/helper/store";

// export default function ProfilePage() {
//   const { user, updateUser, updateAvatar } = Store.useAuth();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({
//     name: user?.fullname || "",
//     email: user?.email || "",
//     phone: user?.contact || "",
//     dateOfBirth: user?.dateOfBirth || "",
//     aadharCard: user?.aadharCard || "",
//     panCard: user?.panCard || "",
//     address: user?.address || "",
//   });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Redirect if not logged in
//   if (!user) {
//     router.push("/login");
//     return null;
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Save changes
//       updateUser(userData);
//       toast.success("Profile updated", {
//         description: "Your profile details have been updated successfully.",
//       });
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleCancelEdit = () => {
//     setUserData({
//       name: user?.name || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//       dateOfBirth: user?.dateOfBirth || "",
//       aadharCard: user?.aadharCard || "",
//       panCard: user?.panCard || "",
//       address: user?.address || "",
//     });
//     setIsEditing(false);
//   };

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // In a real app, you would upload the file to a server
//       // For this demo, we'll just use a placeholder
//       const imageUrl = "/placeholder.svg?height=128&width=128&text=New+Avatar";
//       updateAvatar(imageUrl);
//       toast.success("Profile picture updated", {
//         description: "Your profile picture has been updated successfully.",
//       });
//     }
//   };

//   return (
//     <div className=" mx-auto px-4 py-12">
//       <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
//         <TabsList className="grid grid-cols-3 mb-8">
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="security">Security</TabsTrigger>
//           <TabsTrigger value="preferences">Preferences</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <Card>
//             <CardHeader className="relative p-0">
//               <div className="h-48 bg-gradient-to-r from-primaryBlue to-primaryBlue/80 rounded-t-lg"></div>
//               <div className="absolute -bottom-16 left-8 border-4 border-white dark:border-gray-800 rounded-full overflow-hidden">
//                 <div className="relative w-32 h-32 bg-gray-200 rounded-full">
//                   <Image
//                     src={user.avatar || "/placeholder.svg?height=128&width=128"}
//                     alt={user.name}
//                     fill
//                     className="object-cover"
//                   />
//                   <button
//                     onClick={handleImageClick}
//                     className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
//                   >
//                     <Camera className="h-8 w-8 text-white" />
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     className="hidden"
//                     accept="image/*"
//                   />
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="pt-20 pb-8">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h1 className="text-3xl font-bold">{user.name}</h1>
//                   <p className="text-gray-500 dark:text-gray-400">Client</p>
//                 </div>
//                 {isEditing ? (
//                   <div className="space-x-2">
//                     <Button
//                       onClick={handleEditToggle}
//                       className="bg-primaryBlue hover:bg-primaryBlue/90"
//                     >
//                       <Save className="mr-2 h-4 w-4" />
//                       Save
//                     </Button>
//                     <Button variant="outline" onClick={handleCancelEdit}>
//                       <X className="mr-2 h-4 w-4" />
//                       Cancel
//                     </Button>
//                   </div>
//                 ) : (
//                   <Button
//                     onClick={handleEditToggle}
//                     className="bg-primaryOrange hover:bg-primaryOrange/90"
//                   >
//                     <Pencil className="mr-2 h-4 w-4" />
//                     Edit Profile
//                   </Button>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       Email
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <Mail className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="email"
//                           value={userData.email}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <Mail className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.email}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       Phone Number
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <Phone className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="phone"
//                           value={userData.phone}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <Phone className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.phone}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       Date of Birth
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <Calendar className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="dateOfBirth"
//                           value={userData.dateOfBirth}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <Calendar className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.dateOfBirth}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       Aadhar Card
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <CreditCard className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="aadharCard"
//                           value={userData.aadharCard}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <CreditCard className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.aadharCard}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       PAN Card
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <CreditCard className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="panCard"
//                           value={userData.panCard}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <CreditCard className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.panCard}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <Label className="text-gray-500 dark:text-gray-400">
//                       Address
//                     </Label>
//                     {isEditing ? (
//                       <div className="relative">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                           <MapPin className="h-4 w-4 text-gray-400" />
//                         </div>
//                         <Input
//                           name="address"
//                           value={userData.address}
//                           onChange={handleInputChange}
//                           className="pl-10"
//                         />
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 mt-1">
//                         <MapPin className="h-4 w-4 text-primaryOrange" />
//                         <p>{user.address}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security">
//           <Card>
//             <CardHeader>
//               <CardTitle>Security Settings</CardTitle>
//               <CardDescription>
//                 Manage your security preferences and update your password
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Two-Factor Authentication</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Add an extra layer of security to your account
//                     </p>
//                   </div>
//                   <Switch id="twoFactor" />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Login Notifications</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive alerts when someone logs into your account
//                     </p>
//                   </div>
//                   <Switch id="loginNotifications" defaultChecked />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Remember Devices</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Stay logged in on trusted devices
//                     </p>
//                   </div>
//                   <Switch id="rememberDevices" defaultChecked />
//                 </div>
//               </div>

//               <div className="pt-4 border-t">
//                 <h3 className="font-medium mb-4">Change Password</h3>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="currentPassword">Current Password</Label>
//                     <Input id="currentPassword" type="password" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="newPassword">New Password</Label>
//                     <Input id="newPassword" type="password" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">
//                       Confirm New Password
//                     </Label>
//                     <Input id="confirmPassword" type="password" />
//                   </div>
//                   <Button className="bg-primaryBlue hover:bg-primaryBlue/90">
//                     Update Password
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="preferences">
//           <Card>
//             <CardHeader>
//               <CardTitle>Preferences</CardTitle>
//               <CardDescription>
//                 Manage your notification and display preferences
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Email Notifications</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive updates about your bookings and promotions
//                     </p>
//                   </div>
//                   <Switch id="emailNotifications" defaultChecked />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">SMS Notifications</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive text messages for important updates
//                     </p>
//                   </div>
//                   <Switch id="smsNotifications" />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium">Marketing Communications</h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Receive promotional offers and updates
//                     </p>
//                   </div>
//                   <Switch id="marketingCommunications" />
//                 </div>
//               </div>

//               <div className="pt-4 border-t">
//                 <h3 className="font-medium mb-4">Display Settings</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-medium">Dark Mode</h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Toggle between light and dark theme
//                       </p>
//                     </div>
//                     <Switch id="darkMode" />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-medium">High Contrast</h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Increase contrast for better visibility
//                       </p>
//                     </div>
//                     <Switch id="highContrast" />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-medium">Reduced Motion</h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Minimize animations and transitions
//                       </p>
//                     </div>
//                     <Switch id="reducedMotion" />
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 border-t">
//                 <h3 className="font-medium mb-4">Language and Region</h3>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="language">Language</Label>
//                     <select
//                       id="language"
//                       className="w-full p-2 border rounded-md"
//                     >
//                       <option value="en">English</option>
//                       <option value="hi">Hindi</option>
//                       <option value="mr">Marathi</option>
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="region">Region</Label>
//                     <select
//                       id="region"
//                       className="w-full p-2 border rounded-md"
//                     >
//                       <option value="in">India</option>
//                       <option value="us">United States</option>
//                       <option value="uk">United Kingdom</option>
//                     </select>
//                   </div>
//                   <Button className="bg-primaryBlue hover:bg-primaryBlue/90">
//                     Save Preferences
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <div className="mt-8 max-w-4xl mx-auto">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-2 mb-4">
//             <HelpCircle className="h-5 w-5 text-primaryOrange" />
//             <h2 className="text-xl font-bold">Need Help?</h2>
//           </div>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">
//             If you need assistance with your account or have any questions, our
//             support team is here to help.
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Button variant="outline">Contact Support</Button>
//             <Button variant="outline">FAQs</Button>
//             <Button variant="outline">Privacy Policy</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
