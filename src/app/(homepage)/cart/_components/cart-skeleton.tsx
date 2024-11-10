import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CartSkeleton() {
  return (
    <div className="grid gap-10 md:mx-20 lg:grid-cols-3">
      <div className="rounded-xl p-5 lg:col-span-2">
        <div className="flex w-full items-center gap-4 md:gap-10">
          <Skeleton className="h-20 w-20 rounded-lg md:h-36 md:w-36" />
          <div className="w-full space-y-5">
            <div className="w-full items-center justify-between space-y-2">
              <Skeleton className="h-6 w-20" />
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-6 w-60" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex w-full justify-end">
                <Skeleton className="h-6 w-32 " />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="space-y-12 py-5">
          <Skeleton className="h-6 w-28" />
          <div className="space-y-6">
            <div className="space-y-2 text-muted-foreground">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Separator className="bg-home-border" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
