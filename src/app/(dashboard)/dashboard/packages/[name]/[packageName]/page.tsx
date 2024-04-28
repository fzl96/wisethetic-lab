export default function PackageNamePage({
  params,
}: {
  params: { packageName: string };
}) {
  return <div>{params.packageName}</div>;
}
