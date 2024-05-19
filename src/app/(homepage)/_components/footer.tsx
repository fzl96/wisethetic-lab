import { siteConfig } from "@/config/site";
import Link from "next/link";

const links: { href: string; title: string }[] = [
  { href: "https://mail.google.com", title: "Email" },
  { href: "https://whatsapp.com", title: "WhatsApp" },
  { href: "https://www.instagram.com/mr.wisethetic", title: "Instagram" },
  { href: "https://twitter.com/MrWisethetic", title: "Twitter" },
];
export function Footer() {
  return (
    <footer className="bottom-0 mt-40 grid w-full gap-20 bg-home-footer px-10 pb-4 pt-10">
      <div className="grid grid-cols-2 items-start gap-5 md:grid-cols-5 md:gap-40">
        <div className="col-span-2 md:col-span-1">
          <span className="font-accent text-lg">{siteConfig.name}</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="text-base text-primary">Contact Us</li>
          {links.map((link) => {
            return (
              <li key={link.href} className="hover:text-primary">
                <a href={link.href}>{link.title}</a>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="text-base text-primary">Site</li>
          <li className="hover:text-primary">
            <Link href="/about">About us</Link>
          </li>
          <li className="hover:text-primary">
            <Link href="/portfolio">Gallery</Link>
          </li>
          <li className="hover:text-primary">
            <Link href="/products">Products</Link>
          </li>
          <li className="hover:text-primary">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          &copy; 2024 {siteConfig.name}. All rights reserved
        </p>
      </div>
    </footer>
  );
}
