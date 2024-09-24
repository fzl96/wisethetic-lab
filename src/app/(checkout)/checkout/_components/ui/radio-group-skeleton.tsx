import { Skeleton } from "@/components/ui/skeleton";

export function RadioGroupSkeleton() {
  return (
    <div>
      <div className="w-full space-y-1 rounded-t-[5px] border border-checkout-border bg-white px-5 py-[1.25rem]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded text-right" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-40 rounded text-right" />
        </div>
      </div>
      <div className="w-full space-y-1 rounded-b-[5px] border border-t-0 border-checkout-border bg-white px-5 py-[1.25rem]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded text-right" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-40 rounded text-right" />
        </div>
      </div>
    </div>
  );
}
