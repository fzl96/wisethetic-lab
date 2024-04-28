import { Loader } from "./_components/loader";

export default function Loading() {
  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="flex flex-col gap-2 lg:col-span-2">
        <Loader />
      </div>
      <div className=""></div>
    </div>
  );
}
