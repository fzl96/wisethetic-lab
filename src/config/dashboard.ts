import { Icons } from "@/components/icons";

export type SidebarNav = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
};

export type DashboardConfig = {
  sidebarNav: SidebarNav[];
};

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: "grid",
    },
    {
      title: "Packages",
      href: "/dashboard/packages",
      icon: "package",
    },
    {
      title: "Locations",
      href: "/dashboard/locations",
      icon: "mapPin",
    },
  ],
};
