import { SidebarNavItems } from "./sidebar-nav-items";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <SidebarNavItems />
    </aside>
  );
}
