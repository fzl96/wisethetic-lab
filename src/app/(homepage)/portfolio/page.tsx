import { MaxWidthWrapper } from "../_components/max-width-wrapper";
import { images } from "./_data/data";
import Image from "next/image";

export default function PortfolioPage() {
  return (
    <MaxWidthWrapper className="mt-20 px-6 md:px-10">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-4">
        {images.map((image) => (
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="portfolio image"
              placeholder="blur"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
