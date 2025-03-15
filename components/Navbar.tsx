"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react"; // Added useState
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import logo from "@/public/assets/Dark-Blue-BG-1-1024x1024.jpg";
import Link from "next/link";
import Store from "@/helper/store";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  AppWindow,
  Bell,
  BriefcaseBusiness,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { imageEndpoint } from "@/helper/api";

// const navLinks = [
//   { path: "/", label: "Home" },
//   { path: "/about", label: "About Us" },
//   { path: "/contact", label: "Contact Us" },
// ];

const Navbar = () => {
  const { checkLogin, logout, user, readNotification, clearNotifications } =
    Store.useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveService } = Store.useService();
  const [isSheetOpen, setSheetOpen] = useState(false); // State to manage sheet visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkLogin().then((isLoggedIn) => {
      if (!isLoggedIn) {
        router.push("/sign-in");
      }
    });
  }, [checkLogin, router]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      {/* Logo and Toggle Button */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        {" "}
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-1">
              <Bell className="h-4" /> Notifications
            </SheetTitle>
            <SheetDescription className="flex items-center justify-between">
              <span>Here you can see your notifications</span>
              {user &&
                user.role !== "Admin" &&
                user?.notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearNotifications}
                    className="text-[0.9em] !py-[0.6em] px-[0.8em]"
                  >
                    Clear all
                  </Button>
                )}
            </SheetDescription>
          </SheetHeader>
          {user && user?.notifications.length > 0 ? (
            <div className="flex flex-col gap-2 mt-[1em]">
              {user?.notifications.map((notification) => (
                <Link
                  key={notification._id}
                  href={notification?.redirectPath}
                  onClick={() => {
                    setSheetOpen(false);
                    readNotification(notification?._id || "");
                  }}
                >
                  <Card
                    className={cn(notification.read && "opacity-60 bg-gray-50")}
                  >
                    <CardHeader className="p-2">
                      <CardTitle className="text-[1rem] font-semibold">
                        {notification.title}
                      </CardTitle>
                      <CardDescription className="text-[0.8rem]">
                        {notification.message}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[70%]">
              <span className="text-gray-500 text-md">No notifications</span>
            </div>
          )}
          <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="hidden"
                onClick={() => setSheetOpen(false)}
              >
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className="flex items-center space-x-4">
        <div
          className="p-2 bg-gray-100 rounded-md cursor-pointer"
          onClick={Store.useMain().onToggleSidebar}
        >
          <FiMenu size={20} />
        </div>
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-4"
          onClick={() => setActiveService(null)}
        >
          <Image
            className="object-contain w-8 h-8 sm:w-10 sm:h-10"
            src={logo}
            alt="Contrashutter Logo"
          />
          <div>
            <h1 className="text-sm sm:text-lg font-semibold text-gray-800">
              Contrashutter
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Let&apos;s Make It Memorable
            </p>
          </div>
        </Link>
      </div>

      {/* Right side navigation */}
      <div className="relative flex items-center">
        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <FiMenu size={20} />
        </button>

        {/* Desktop Navigation - All items */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/" onClick={() => setActiveService(null)}>
            <Button
              variant="ghost"
              className={`${
                pathname === "/"
                  ? "text-primaryBlue font-semibold bg-gray-100"
                  : "hover:text-primaryBlue/80"
              } transition duration-300`}
            >
              Home
            </Button>
          </Link>
          <Link href="/about" onClick={() => setActiveService(null)}>
            <Button
              variant="ghost"
              className={`${
                pathname === "/about"
                  ? "text-primaryBlue font-semibold bg-gray-100"
                  : "hover:text-primaryBlue/80"
              } transition duration-300`}
            >
              About Us
            </Button>
          </Link>
          <Link href="/contact" onClick={() => setActiveService(null)}>
            <Button
              variant="ghost"
              className={`${
                pathname === "/contact"
                  ? "text-primaryBlue font-semibold bg-gray-100"
                  : "hover:text-primaryBlue/80"
              } transition duration-300`}
            >
              Contact
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg py-2 md:hidden z-50">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={() => {
                  setActiveService(null);
                  setMobileMenuOpen(false);
                }}
              >
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link
                href="/about"
                onClick={() => {
                  setActiveService(null);
                  setMobileMenuOpen(false);
                }}
              >
                <Button variant="ghost" className="w-full justify-start">
                  About Us
                </Button>
              </Link>
              <Link
                href="/contact"
                onClick={() => {
                  setActiveService(null);
                  setMobileMenuOpen(false);
                }}
              >
                <Button variant="ghost" className="w-full justify-start">
                  Contact
                </Button>
              </Link>
              <div className="border-t mt-2 pt-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start mt-1">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Links */}
      {user ? (
        <ul className="flex items-center space-x-3 text-gray-600">
          <li className="flex items-center space-x-1">
            <Menubar className="rounded-none shadow-none border-b pb-2 focus:bg-transparent border-gray-300 border-x-0 border-t-0">
              <MenubarMenu>
                <MenubarTrigger className="space-x-3">
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage
                      src={
                        user?.profileImage
                          ? `${imageEndpoint}${user?.profileImage}`
                          : "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm flex items-center border-none">
                    {user?.fullname}
                    <IoMdArrowDropdown className="mx-1 text-lg text-regular" />
                  </span>
                </MenubarTrigger>

                <MenubarContent>
                  <Link href="/profile">
                    <MenubarItem>
                      <User className="h-4 -translate-x-[0.1em]" />
                      <span>Profile</span>
                    </MenubarItem>
                  </Link>

                  <Link
                    href={`${
                      user.role == "Client"
                        ? "/client/my-bookings"
                        : user.role == "Service Provider"
                        ? "/partner/partner-program"
                        : user.role == "Admin"
                        ? "/admin/bookings"
                        : "/"
                    }`}
                    onClick={() => setActiveService(null)}
                  >
                    {" "}
                    <MenubarItem>
                      {" "}
                      <BriefcaseBusiness className="h-4 -translate-x-[0.1em]" />
                      My Account{" "}
                    </MenubarItem>
                  </Link>

                  <MenubarItem onClick={() => setSheetOpen(true)}>
                    {" "}
                    {/* Added onClick to open sheet */}
                    <Bell className="h-4 -translate-x-[0.1em]" />
                    <span>Notifications</span>
                  </MenubarItem>

                  <Link href="/wishlist">
                    <MenubarItem className="flex items-center">
                      <ShoppingCart className="h-4 -translate-x-[0.1em]" />
                      <span>Wishlist</span>
                    </MenubarItem>
                  </Link>
                  <Link href={pathname} target="_blank">
                    <MenubarItem>
                      <AppWindow className="h-4 -translate-x-[0.1em]" />
                      <span>New Window</span>
                    </MenubarItem>
                  </Link>
                  <MenubarSeparator />
                  <Link href="/sign-in">
                    <MenubarItem
                      className="flex items-center"
                      onClick={() => {
                        logout();
                        setActiveService(null);
                      }}
                    >
                      <LogOut className="h-4 translate-y-[0.1em]" />

                      <span>Log out</span>
                    </MenubarItem>
                  </Link>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <Link href="/wishlist">
              <Button variant="ghost" className="relative">
                <ShoppingCart />
                {user?.wishlist.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-1 right-2 text-[0.7rem] p-1 py-0  leading-none"
                  >
                    {user?.wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => setSheetOpen(true)}
              className="relative"
            >
              {user?.notifications.filter((notification) => !notification.read)
                .length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 right-2 text-[0.7rem] p-1 py-0  leading-none"
                >
                  {
                    user?.notifications.filter(
                      (notification) => !notification.read
                    ).length
                  }
                </Badge>
              )}
              <Bell />
            </Button>
          </li>
        </ul>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Navbar;
