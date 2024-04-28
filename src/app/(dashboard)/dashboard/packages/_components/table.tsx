import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getPackages } from "@/server/api/packages/queries";
import { getCategories } from "@/server/api/categories/queries";

export async function PackagesTable() {
  const packages = await getPackages({});
  const categories = await getCategories({});

  return (
    <div className="">
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Packages</CardTitle>
          <CardDescription>
            A list of all packages in the store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={packages}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
