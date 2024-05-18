import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getOrdersSummary } from "@/server/api/orders/queries";

export default async function SummaryCards() {
  const ordersCount = await getOrdersSummary();
  const count = {
    process: ordersCount?.process ?? 0,
    completed: ordersCount?.completed ?? 0,
    total: ordersCount?.total ?? 0,
    sum: isNaN(Number(ordersCount?.sum)) ? 0 : Number(ordersCount?.sum),
  };

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle>Revenue from Completed orders</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Total revenue generated from all orders that have been successfully
            completed and finalized
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-3xl font-semibold">
          {currencyFormatter.format(count.sum)}
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <CardDescription>Completed Orders</CardDescription>
          <CardTitle className="text-4xl">{ordersCount?.completed}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {count.completed} out of {count.total} completed
            {/* +25% from last week */}
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={
              count.completed !== 0 ? (count.completed / count.total) * 100 : 0
            }
            aria-label={`${count.completed} out of ${count.total}`}
          />
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2">
        <CardHeader className="pb-2">
          <CardDescription>On Process</CardDescription>
          <CardTitle className="text-4xl">{count.process}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {count.process} out of {count.total} on process
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={
              count.process !== 0 ? (count.process / count.total) * 100 : 0
            }
            aria-label={`${count.process} out of ${count.total}`}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
