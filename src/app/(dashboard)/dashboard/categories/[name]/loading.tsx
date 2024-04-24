import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
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
        <div className="grid h-96 place-items-center overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
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
