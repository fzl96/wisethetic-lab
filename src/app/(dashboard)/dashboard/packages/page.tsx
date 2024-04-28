import { getCategories } from "@/server/api/categories/queries";
import { redirect } from "next/navigation";
import { convertToSlug } from "@/lib/utils";

export default async function PackagesPage() {
  const categories = await getCategories({});
  const slug = convertToSlug(categories[0]?.name ?? "");

  return redirect(`/dashboard/packages/${slug}`);
}
