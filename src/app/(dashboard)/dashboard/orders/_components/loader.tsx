import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function OrderSummaryCardsLoader() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Revenue from Completed orders</CardTitle>
          <CardDescription className="grid max-w-lg gap-1 text-balance leading-relaxed">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-3xl font-semibold">
          {/* {currencyFormatter.format(count.sum)} */}
          <Skeleton className="h-[3.2rem] w-full" />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <CardDescription>Completed Orders</CardDescription>
          <CardTitle className="text-4xl">
            <Skeleton className="h-8 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* {count.completed} out of {count.total} completed */}
          <Skeleton className="h-4 w-20" />
        </CardContent>
        <CardFooter>
          {/* <Progress
            value={
              count.completed !== 0 ? (count.completed / count.total) * 100 : 0
            }
            aria-label={`${count.completed} out of ${count.total}`}
          /> */}
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <CardHeader className="pb-2">
          <CardDescription>On Process</CardDescription>
          <CardTitle className="text-4xl">
            <Skeleton className="h-8 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-20" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}

export function OrdersTableLoader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto">
        <Skeleton className="h-7 w-7 md:w-20" />
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export function OrderCardLoader() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start">
        <div className="grid gap-2">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <Skeleton className="h-6 w-20" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 text-sm dark:bg-card">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-row items-center px-6 py-3">
        <div className="text-xs text-muted-foreground">
          <Skeleton className="h-5 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
}
