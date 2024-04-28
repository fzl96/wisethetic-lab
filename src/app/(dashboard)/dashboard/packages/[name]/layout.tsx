import { Suspense } from "react";
import { PackagesTable } from "../_components/table";
import { Loader } from "../_components/loader";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="flex flex-col gap-2 lg:col-span-2">
        <Suspense fallback={<Loader />}>
          <PackagesTable categoryName={params.name} />
        </Suspense>
      </div>
      <div className="">{children}</div>
    </div>
  );
}
