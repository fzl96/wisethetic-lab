"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { ShoppingCart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./mobile-nav";
import { MobileNavToggle } from "./mobile-nav-toggle";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const user = useCurrentUser();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: {
            y: 0,
          },
          hidden: {
            y: "-100%",
          },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.2 }}
        className="sticky top-0 z-30 w-full bg-home-background"
      >
        <div className="flex items-center justify-between px-8 py-6">
          <div className="">
            <Link
              href="/"
              className="font-firaSans uppercase tracking-[0.25em] text-primary-accent md:text-xl"
            >
              {siteConfig.name}
            </Link>
          </div>
          <nav className="hidden items-center gap-4 md:flex ">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/portfolio">Portfolio</Link>
              </li>
            </ul>
            {!user && <Link href="/auth/sign-in">Login</Link>}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="border-none outline-none">
                  Account
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="mt-2 w-40 rounded-lg border-none bg-home-card-background p-0 "
                >
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none rounded-t-lg border-b px-5 py-3"
                    asChild
                  >
                    <Link href="/account">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none border-b px-5 py-3"
                    asChild
                  >
                    <Link href="/account/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer rounded-none rounded-b-lg px-5 py-3 text-[#FF453A] hover:text-[#FF453A]"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ModeToggle variant="ghost" />
            <span>|</span>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <div className="absolute -right-2.5 -top-2 grid h-5 w-5 place-items-center rounded-full  bg-primary-accent text-xs font-semibold">
                {user?.cartItemsCount ?? 0}
              </div>
            </Link>
          </nav>
          <div className="block md:hidden">
            <MobileNavToggle />
          </div>
        </div>
      </motion.header>
      <MobileNav />
    </>
  );
}
