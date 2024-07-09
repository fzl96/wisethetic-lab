import Image from "next/image";
import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { images } from "./_data/data";
import { DynamicImage } from "./_components/dynamic-image";

export default function PortfolioPage() {
  return (
    <MaxWidthWrapper className="mt-20 px-6 md:px-10">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-4">
        {images.map((image, index) => (
          <DynamicImage key={`image-${index}`} url={image} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
