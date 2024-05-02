import { Skeleton } from "@/components/ui/skeleton";

export function PackageCardsLoader() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
      {Array.from({ length: 3 }).map((_, i) => {
        return <Card key={i} />;
      })}
    </div>
  );
}

function Card() {
  return (
    <div className="rounded-xl border border-home-border bg-home-card-background p-3 shadow-sm transition-all duration-200 hover:bg-home-card-background-hover">
      <div className="h-96 overflow-hidden rounded-lg lg:h-[35rem] ">
        <Skeleton className="h-full" />
      </div>
      <div className="space-y-2 px-2 py-5 text-left ">
        <h3 className="text-left font-accent text-2xl font-normal">
          <Skeleton className="h-6 w-1/2" />
        </h3>
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
