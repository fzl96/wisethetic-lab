import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col bg-home-background text-home-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
