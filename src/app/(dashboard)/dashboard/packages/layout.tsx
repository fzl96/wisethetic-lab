import { Suspense } from "react";
import { PackagesTable } from "./_components/table";

export default async function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="flex flex-col gap-2 lg:col-span-2">
        <div className="flex-end flex items-center justify-between">
          <div className="ml-auto">{/* <CreateCategory /> */}</div>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <PackagesTable />
        </Suspense>
      </div>
      <div className="">{children}</div>
    </div>
  );
}
