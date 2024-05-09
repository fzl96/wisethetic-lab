import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import "@uploadthing/react/styles.css";

import { Inter, Archivo } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ReactQueryProvider } from "@/components/react-query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Photography",
    "Aesthetic",
    "Lifestyle",
    "Creative",
    "Fashion",
    "Art",
  ],
  authors: [
    {
      name: "Naufal Hadi",
      url: siteConfig.links.instagram,
    },
    {
      name: "Honeyberry",
      url: "https://honeyberry.me",
    },
    {
      name: "Mochammad Farkhan",
      url: "https://github.com/mochammadfarkhan",
    },
  ],
  creator: "Naufal Hadi",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: `${siteConfig.url}/og.jpg`, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@MrWisethetic",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={cn(
            inter.variable,
            archivo.variable,
            "font-sans antialiased selection:bg-foreground selection:text-background",
          )}
        >
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <div
                  vaul-drawer-wrapper=""
                  className="min-h-screen bg-background"
                >
                  {children}
                </div>
              </TooltipProvider>
              <Toaster closeButton richColors position="top-center" />
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
