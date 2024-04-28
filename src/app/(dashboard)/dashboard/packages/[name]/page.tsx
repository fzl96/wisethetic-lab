import { getPackagesWithCategory } from "@/server/api/packages/queries";

export default async function CategoryName({
  params,
}: {
  params: { name: string };
}) {
  const packages = await getPackagesWithCategory();
  console.log(packages);
  return (
    <div>
      <h1>{params.name}</h1>
    </div>
  );
}
