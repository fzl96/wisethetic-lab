import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function TableLoader() {
  return (
    <div className="grid gap-2">
      <div className="flex-end flex items-center justify-between">
        <div className="ml-auto">
          {/* <Skeleton className="h-7 w-24" /> */}
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:not-sr-only sm:whitespace-nowrap ">
              Add Category
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            A list of all categories in the store.
          </CardDescription>
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
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                disabled
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                disabled
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CardLoader() {
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
