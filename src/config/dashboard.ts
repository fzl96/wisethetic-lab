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
      title: "Orders",
      href: "/dashboard/orders",
      icon: "shoppingCart",
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: "package",
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: "users",
    },
  ],
};
