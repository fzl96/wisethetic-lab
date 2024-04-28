export default function Category({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
