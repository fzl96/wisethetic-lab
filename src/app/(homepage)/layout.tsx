import { Navbar } from "./_components/navbar";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-home-background text-home-foreground min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
