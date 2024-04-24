import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
