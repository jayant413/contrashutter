"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import Store from "@/helper/store";

// Constants outside component to prevent recreation
const ROUTE_CONFIG = {
  public: [
    "/about",
    "/contact",
    "/services",
    "/event",
    "/package",
    "/login",
    "/terms-conditions",
    "/privacy-policy",
    "/faqs",
    "/return-replace-policy",
    "/service-cancellation-policy",
    "/refund-policy",
  ],
  roleBased: {
    admin: "/admin",
    client: "/client",
    partner: "/partner",
  },
} as const;

type Role = "Admin" | "Client" | "Service Provider";

const RouteGuard = () => {
  const { user, loading } = Store.useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Memoize path matching to prevent recalculation
  const isPublicRoute = useMemo(
    () =>
      ROUTE_CONFIG.public.some(
        (route) => pathname === route || pathname.startsWith(route)
      ),
    [pathname]
  );

  useEffect(() => {
    const verifyAccess = async () => {
      // Skip verification for public routes
      if (isPublicRoute) return;

      // Handle unauthenticated users
      if (!user && !loading) {
        router.push("/");
        return;
      }

      // Role-based access checks
      const roleChecks: Record<Role, () => void> = {
        Admin: () => {
          if (
            pathname.startsWith(ROUTE_CONFIG.roleBased.admin) &&
            user?.role !== "Admin"
          ) {
            router.push("/");
            toast.error("Unauthorized access. Admin privileges required.");
          }
        },
        Client: () => {
          if (
            pathname.startsWith(ROUTE_CONFIG.roleBased.client) &&
            user?.role !== "Client"
          ) {
            router.push("/");
            toast.error("Unauthorized access. Client account required.");
          }
        },
        "Service Provider": () => {
          if (
            pathname.startsWith(ROUTE_CONFIG.roleBased.partner) &&
            user?.role !== "Service Provider"
          ) {
            router.push("/");
            toast.error(
              "Unauthorized access. Service Provider account required."
            );
          }
        },
      };

      // Execute appropriate role check
      if (user?.role) {
        roleChecks[user.role]();
      }
    };

    verifyAccess();
  }, [pathname, user, router, loading, isPublicRoute]);

  return null;
};

export default RouteGuard;
