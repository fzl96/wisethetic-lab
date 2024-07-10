import { Suspense } from "react";
import Image from "next/image";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { images } from "./_data/data";
import { DynamicImage } from "./_components/dynamic-image";
import { Icons } from "@/components/icons";

export default function PortfolioPage() {
  return (
    <MaxWidthWrapper className="mt-20 px-6 md:px-10">
      <Suspense
        fallback={
          <div className="grid min-h-screen w-full place-items-center">
            <Icons.spinner className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-4">
          {images.map((image, index) => (
            <DynamicImage key={`image-${index}`} url={image} index={index} />
          ))}
        </div>
      </Suspense>
    </MaxWidthWrapper>
  );
}
