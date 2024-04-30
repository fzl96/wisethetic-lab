export default async function CategoryName({
  params,
}: {
  params: { name: string };
}) {
  return (
    <div>
      <h1>{params.name}</h1>
    </div>
  );
}
