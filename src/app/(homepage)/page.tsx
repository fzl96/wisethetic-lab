import Link from "next/link";

import { MaxWidthWrapper } from "./_components/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategorySection } from "./_components/category-section";
import { Suspense } from "react";
import { CategoryCardsLoader } from "./services/_components/loader";

export default function HomePage() {
  return (
    <MaxWidthWrapper className="mt-28 flex flex-col items-center justify-center px-5 pb-12  text-center sm:mt-32">
      <Badge>Wisethetic</Badge>
      <h1 className="font mt-5 grid max-w-4xl gap-3 font-accent text-5xl leading-none md:text-6xl lg:text-[5rem]">
        <span>
          Crafting <span className="text-[#ce9651]">Ideas </span>
        </span>
        <span>
          With <span>Intentions</span>
        </span>
      </h1>
      <p className="mt-7 max-w-xl text-2xl font-light">
        Your dedicated creative partner in shaping an exceptional online
        presence.
      </p>

      <Link
        href="/services"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "group mt-10",
        )}
      >
        See Services
        <span className="ml-2 transition-transform group-hover:translate-x-2">
          <ArrowRight className="h-5 w-5" />
        </span>
      </Link>

      <Suspense
        fallback={
          <div className="mt-40 w-full">
            <CategoryCardsLoader />
          </div>
        }
      >
        <CategorySection />
      </Suspense>
    </MaxWidthWrapper>
  );
}
