import Image from "next/image";
import { getImage } from "@/lib/get-image";

export async function DynamicImage({
  url,
  index,
}: {
  url: string;
  index: number;
}) {
  const { base64, img } = await getImage(url);

  return (
    <div className="relative mb-4 overflow-hidden rounded-lg">
      <Image
        {...img}
        alt="portfolio image"
        placeholder="blur"
        blurDataURL={base64}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}
