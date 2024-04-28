import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getPackagesWithCategory } from "@/server/api/packages/queries";
import { getCategories } from "@/server/api/categories/queries";
import { CreatePackage } from "./actions";
import { reverseSlug } from "@/lib/utils";

interface PackagesTableProps {
  categoryName?: string;
}

export async function PackagesTable({ categoryName }: PackagesTableProps) {
  const name = reverseSlug(categoryName ?? "");
  const packages = await getPackagesWithCategory(name);
  const categories = await getCategories({});

  return (
    <div className="grid gap-2">
      <div className="flex-end flex items-center justify-between">
        <div className="ml-auto">
          {categories && <CreatePackage categories={categories} />}
        </div>
      </div>
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
            categoryName={reverseSlug(categoryName ?? "")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
