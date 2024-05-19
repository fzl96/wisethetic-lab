import { Skeleton } from "@/components/ui/skeleton";

export function ContentLoader() {
  return (
    <>
      <div className="h-96 overflow-hidden lg:h-[40rem] lg:w-[35rem]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-14 w-56 md:w-80" />
          <Skeleton className="h-7 md:w-[28rem]" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full md:w-[28rem]" />
          <Skeleton className="h-10 w-full md:w-[28rem]" />
          <Skeleton className="h-10 w-full md:w-[28rem]" />
        </div>
        <Skeleton className="h-12 w-full md:w-[28rem]" />
      </div>
    </>
  );
}
