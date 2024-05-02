"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/use-current-user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const user = useCurrentUser();
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [top, setTop] = useState(true);
  const dark = theme === "dark";
  const bgLight = top ? "rgba(218, 217, 215, 0)" : "rgba(218, 217, 215, 0.2)";
  const bgDark = top ? "rgba(75, 75, 75, 0)" : "rgba(75, 75, 75, 0.2)";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 10) {
      setTop(true);
    } else {
      setTop(false);
    }
    if (latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      variants={{
        visible: {
          y: 0,
          backgroundColor: "transparent",
          backdropFilter: "blur(15px)",
        },
        hidden: {
          y: "-100%",
        },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.2 }}
      className="sticky top-6 z-30 w-full px-5"
    >
      <motion.div
        variants={{
          visibleChild: {
            // opacity: 1,
            backgroundColor: dark ? bgDark : bgLight,
          },
          hiddenChild: {
            // opacity: 0,
          },
        }}
        animate={hidden ? "hiddenChild" : "visibleChild"}
        className="flex items-center justify-between rounded-lg px-5 py-5"
      >
        <div className="hidden md:block">
          <span className="font-accent text-xl tracking-wide text-[#ce9651]">
            Wisethetic Lab
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
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
                  className="cursor-pointer rounded-none rounded-t-lg px-5 py-3"
                  asChild
                >
                  <Link href="/account">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer rounded-none px-5 py-3"
                  asChild
                >
                  <Link href="/account/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer rounded-none rounded-b-lg px-5 py-3 text-red-500"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <span>|</span>
          <ModeToggle />
        </nav>
      </motion.div>
    </motion.header>
  );
}
