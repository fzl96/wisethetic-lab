"use client";

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";

export function Navbar() {
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
      className="sticky top-6 w-full px-5"
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
            <li>About</li>
            <li>Products</li>
            <li>Portfolio</li>
          </ul>
          <span>|</span>
          <Link href="/auth/sign-in">Login</Link>
          <ModeToggle />
        </nav>
      </motion.div>
    </motion.header>
  );
}
