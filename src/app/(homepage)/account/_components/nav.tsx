"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./sign-out";

const Links: { href: string; title: string }[] = [
  { href: "/account", title: "General" },
  { href: "/account/orders", title: "Orders" },
];

export function Nav() {
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground md:sticky md:top-10"
      x-chunk="dashboard-04-chunk-0"
    >
      {Links.map((link) => {
        return <NavLink key={link.href} href={link.href} title={link.title} />;
      })}
      <SignOutButton className="mt-5" />
    </nav>
  );
}

export function NavLink({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  const active =
    (pathname.startsWith(href) && href !== "/account") ||
    (pathname === href && href === "/account");

  return (
    <Link
      href={href}
      className={cn(
        active && "font-semibold text-primary",
        "hover:text-primary",
      )}
    >
      {title}
    </Link>
  );
}
