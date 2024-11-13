import { Suspense } from "react";
import { LocationsTable } from "./_components/table";
import { LocationsTableLoader } from "./_components/table-loader";
import { AddLocation } from "./_components/actions";

export default function LocationsPage({
  searchParams,
}: {
  searchParams?: {
    location_id: string;
    query: string;
    page: string;
  };
}) {
  const locationId = searchParams?.location_id;
  const query = searchParams?.query ?? "";
  const page = isNaN(Number(searchParams?.page))
    ? 1
    : Number(searchParams?.page);

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="space-y-2">
          <div className="flex w-full justify-end">
            <AddLocation />
          </div>
          <Suspense fallback={<LocationsTableLoader />}>
            <LocationsTable
              page={page}
              locationId={locationId ?? ""}
              query={query}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
