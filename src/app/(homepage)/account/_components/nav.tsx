"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Links: { href: string; title: string }[] = [
  { href: "/account", title: "General" },
  { href: "/account/orders", title: "Orders" },
  { href: "/account/addresses", title: "Addresses" },
  { href: "/account/payment-methods", title: "Payment methods" },
  { href: "/account/notifications", title: "Notifications" },
];

export function Nav() {
  return (
    <nav
      className="sticky top-10 grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {Links.map((link) => {
        return <NavLink key={link.href} href={link.href} title={link.title} />;
      })}
    </nav>
  );
}

export function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        pathname === href && "font-semibold text-primary",
        "hover:text-primary",
      )}
    >
      {title}
    </Link>
  );
}
