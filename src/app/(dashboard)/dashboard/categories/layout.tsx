import { Suspense } from "react";
import { CategoriesTable } from "./_components/table";
import { CreateCategory } from "./_components/actions";
import { TableLoader } from "./_components/loader";

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="flex flex-col gap-2 lg:col-span-2">
        <div className="flex-end flex items-center justify-between">
          <div className="ml-auto">
            <CreateCategory />
          </div>
        </div>
        <Suspense fallback={<TableLoader />}>
          <CategoriesTable />
        </Suspense>
      </div>
      <div className="">{children}</div>
    </div>
  );
}
