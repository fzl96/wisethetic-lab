"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { type SidebarNav, dashboardConfig } from "@/config/dashboard";
import { Aperture } from "lucide-react";

export function SidebarNavItems() {
  return (
    <>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link href="/">
          <Aperture />
        </Link>
        {dashboardConfig.sidebarNav.map((item) => (
          <SidebarNavItem key={item.title} item={item} />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Icons.settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </>
  );
}

function SidebarNavItem({ item }: { item: SidebarNav }) {
  const pathname = usePathname();
  const active =
    (pathname.startsWith(item.href) && item.href !== "/dashboard") ||
    (pathname === item.href && item.href === "/dashboard");
  const Icon = Icons[item.icon];

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            active && "bg-accent text-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{item.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}
