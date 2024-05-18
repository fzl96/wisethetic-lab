import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { format } from "date-fns";
import { getCategoryByName } from "@/server/api/categories/queries";
import { CategoryMenu } from "../_components/actions";

export async function CategoryCard({ itemName }: { itemName: string }) {
  const category = await getCategoryByName(itemName);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-5">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {category?.name}
          </CardTitle>
          <CardDescription>{category?.description}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {category && <CategoryMenu category={category} />}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 text-sm dark:bg-card">
        <div className="h-96 overflow-hidden rounded-lg">
          <Image
            src={category?.image ?? "/placeholder.jpg"}
            alt={category?.name ?? "Category Image"}
            width={300}
            height={500}
            className="h-full w-full object-cover transition-all duration-500 hover:scale-105 dark:brightness-[0.5] dark:grayscale hover:dark:grayscale-0"
          />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-row items-center px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time
            dateTime={format(new Date(category?.updatedAt ?? ""), "yyyy-MM-dd")}
          >
            {format(new Date(category?.updatedAt ?? ""), "MMMM d, yyyy")}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
