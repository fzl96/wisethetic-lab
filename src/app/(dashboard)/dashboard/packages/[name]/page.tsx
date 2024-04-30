import { getPackagesWithCategory } from "@/server/api/packages/queries";

export default async function CategoryName({
  params,
}: {
  params: { name: string };
}) {
  const packages = await getPackagesWithCategory();
  return (
    <div>
      <h1>{params.name}</h1>
    </div>
  );
}
