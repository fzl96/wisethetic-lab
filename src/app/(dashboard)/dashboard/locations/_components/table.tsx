import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLocations, getLocationsPage } from "@/server/api/locations/queries";
import Link from "next/link";
import { SearchFilter } from "./table-filter";
import { TablePagination } from "./table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LocationMenu } from "./actions";

interface LocationsTableProps {
  locationId?: string;
  page: number;
  query: string;
}

export async function LocationsTable({
  locationId,
  page,
  query,
}: LocationsTableProps) {
  const [locations, totalPages] = await Promise.all([
    getLocations(query, page),
    getLocationsPage(query),
  ]);

  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto "></div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Locations</CardTitle>
          <CardDescription>
            A list of available meeting locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 w-80">
            <SearchFilter placeholder="Search place" />
          </div>
          {locations.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Address
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Map</TableHead>
                  <TableHead className="sr-only hidden md:table-cell">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow
                    key={location.id}
                    className={cn(locationId === location.id && "bg-muted/50")}
                  >
                    <TableCell>
                      <Link href={{ query: { order_id: location.id } }}>
                        <div className="font-medium">{location.name}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="hidden text-sm md:inline">
                        {location.address}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <a
                        href={location.link ?? "#"}
                        target="_blank"
                        className="underline"
                      >
                        See on map
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <LocationMenu location={location} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid place-items-center">
              <span>Locations is empty.</span>
            </div>
          )}
        </CardContent>
      </Card>
      <Suspense
        fallback={
          <div className="grid place-items-center">
            <Skeleton className="h-6 w-80 text-center" />
          </div>
        }
      >
        <TablePagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
