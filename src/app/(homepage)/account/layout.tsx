import { ThemeProvider } from "@/components/theme-provider";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { Nav } from "./_components/nav";

export default function AccountLayout({
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
      <MaxWidthWrapper className="mt-20 min-h-screen px-7 md:px-0">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Account</h1>
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <Nav />
          {children}
        </div>
      </MaxWidthWrapper>
    </ThemeProvider>
  );
}
