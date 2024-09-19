import { ThemeProvider } from "@/components/theme-provider";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider forcedTheme="light">test{children}</ThemeProvider>;
}
