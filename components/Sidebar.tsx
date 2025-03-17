"use client";
import Store from "@/helper/store";
import {
  HomeIcon,
  Camera,
  Brush,
  Gift,
  User,
  Box,
  HelpCircle,
  Handshake,
  List,
  Grid2X2,
  BrushIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const Sidebar = () => {
  const currentPath = usePathname();
  const { user } = Store.useAuth();
  const { isShowSidebar, onToggleSidebar } = Store.useMain(); // Added onToggleSidebar
  const { allServices, getAllServices, setActiveService, activeService } =
    Store.useService();

  useEffect(() => {
    if (!allServices) {
      getAllServices();
    }
  }, [allServices, getAllServices]);

  // Check if the current path belongs to `/account` or `/admin`
  const isAccountPage =
    currentPath.startsWith("/client") ||
    (currentPath.startsWith("/profile") && user?.role === "Client") ||
    (currentPath.startsWith("/wishlist") && user?.role === "Client");

  const isAdminPage =
    currentPath.startsWith("/admin") ||
    (currentPath.startsWith("/profile") && user?.role === "Admin") ||
    (currentPath.startsWith("/wishlist") && user?.role === "Admin");
  const isPartnerPage =
    currentPath.startsWith("/partner") ||
    (currentPath.startsWith("/profile") && user?.role === "Service Provider") ||
    (currentPath.startsWith("/wishlist") && user?.role === "Service Provider");

  // Define the menu items dynamically
  const menuItems = isAccountPage
    ? [
        {
          href: "/profile",
          label: "Profile",
          icon: User,
        },
        {
          href: "/client/my-bookings",
          label: "My Bookings",
          icon: List,
        },
        {
          href: "/client/deliverables",
          label: "Deliverables",
          icon: Box,
        },
        {
          href: "/client/support",
          label: "Support / Help",
          icon: HelpCircle,
        },
      ]
    : isAdminPage
    ? [
        {
          href: "/profile",
          label: "Profile",
          icon: User,
        },

        { href: "/admin/bookings", label: "All Bookings", icon: List },
        {
          href: "/admin/service-partners",
          label: "Service Partners",
          icon: Handshake,
        },
        { href: "/admin/banner", label: "Banners", icon: Grid2X2 },
        { href: "/admin/customize", label: "Customize", icon: BrushIcon },
      ]
    : isPartnerPage
    ? [
        {
          href: "/profile",
          label: "Profile",
          icon: User,
        },

        {
          href: "/partner/bookings",
          label: "Bookings",
          icon: List,
          hide: user?.status !== "Active",
        },
        {
          href: "/partner/partner-program",
          label: "Partner Program",
          icon: Handshake,
        },
        {
          href: "/partner/support",
          label: "Support / Help",
          icon: HelpCircle,
        },
      ]
    : [{ href: "/", label: "Home", icon: HomeIcon }];

  const handleClick = () => {
    // Defined type of href
    if (window.innerWidth < 1024) {
      onToggleSidebar(); // Close sidebar on click if screen width is less than 1024px
    }
    setActiveService(null);
  };

  return (
    <div
      className={`absolute lg:relative bg-white z-30 border-r bg-alice-900 text-black h-full pt-8 ${
        isShowSidebar ? "w-[20em] shadow-lg" : "w-0"
      } overflow-hidden duration-300`}
    >
      {/* Menu Items */}
      <ul className={`${isShowSidebar ? "block" : "hidden"}`}>
        {allServices ? (
          menuItems.map(({ href, label, icon: Icon, hide }) => (
            <Link href={href} key={href} onClick={() => handleClick()}>
              <li
                className={`flex items-center gap-x-4 mt-[0.5em] pl-[2em] cursor-pointer p-2  ${
                  currentPath === href
                    ? "bg-blue-900 text-orange-500"
                    : "hover:bg-gray-200 text-neutral-600 hover:text-neutral-900 "
                } font-semibold ${hide ? "hidden" : ""}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </li>
            </Link>
          ))
        ) : (
          <Skeleton className="w-full h-[3em] mt-[0.5em]" />
        )}

        {!isAccountPage && !isAdminPage && !isPartnerPage && allServices ? (
          <div className={`${isShowSidebar ? "block" : "hidden"}`}>
            {allServices.map((service) => (
              <Link
                href={`/services/${service._id}`}
                key={service._id}
                onClick={() => {
                  handleClick();
                  setActiveService(service);
                }}
              >
                <li
                  className={`flex items-center gap-x-4 mt-[0.5em] pl-[2em] cursor-pointer p-2  ${
                    activeService?._id === service._id
                      ? "bg-blue-900 text-orange-500"
                      : "hover:bg-gray-200 text-neutral-600 hover:text-neutral-900 "
                  } font-semibold`}
                >
                  {service.name.trim() === "Photography" ? (
                    <Camera size={20} />
                  ) : service.name.trim() === "Makeup" ? (
                    <Brush size={20} />
                  ) : service.name.trim() === "Decoration" ? (
                    <Gift size={20} />
                  ) : null}
                  <span>{service.name}</span>
                </li>
              </Link>
            ))}
          </div>
        ) : (
          !isAccountPage &&
          !isAdminPage &&
          !isPartnerPage && (
            <div>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="w-full h-[3em] mt-[0.5em]" />
              ))}
            </div>
          )
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
