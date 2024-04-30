import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

export function Loader() {
  return (
    <div className="grid gap-2">
      <div className="flex-end flex items-center justify-between">
        <div className="ml-auto">
          {/* <Skeleton className="h-7 w-24" /> */}
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:not-sr-only sm:whitespace-nowrap ">
              Add Package
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Packages</CardTitle>
          <CardDescription>
            A list of all packages in the store.
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
