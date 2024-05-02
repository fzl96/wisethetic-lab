import Link from "next/link";

const links: { href: string; title: string }[] = [
  { href: "#", title: "Email" },
  { href: "#", title: "WhatsApp" },
  { href: "#", title: "Instagram" },
  { href: "#", title: "Twitter" },
];
export function Footer() {
  return (
    <footer className="bg-home-footer bottom-0 mt-40 grid w-full gap-20 px-10 pb-4 pt-10">
      <div className="flex flex-col items-start md:flex-row md:gap-40">
        <div>
          <span className="font-accent text-lg">Wisethetic Lab</span>
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
          &copy; 2024 Wisethetic Lab. All rights reserved
        </p>
      </div>
    </footer>
  );
}
