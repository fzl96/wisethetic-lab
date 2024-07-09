import Image from "next/image";
import { getImage } from "@/lib/get-image";

export async function DynamicImage({ url }: { url: string }) {
  const { base64, img } = await getImage(url);
  console.log(base64);

  return (
    <div className="relative mb-4">
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
