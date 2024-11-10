import { ThemeProvider } from "@/components/theme-provider";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="light" forcedTheme="light" attribute="class">
      {children}
    </ThemeProvider>
  );
}
