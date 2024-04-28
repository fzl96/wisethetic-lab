import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/server/api/categories/queries";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function CategoriesTable() {
  const categories = await getCategories({});

  return (
    <div className="">
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            A list of all categories in the store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
