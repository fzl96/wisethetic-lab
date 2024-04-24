import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryTableRender } from "./table-render";
import { getCategories } from "@/server/api/categories/queries";

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
          <CategoryTableRender categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
