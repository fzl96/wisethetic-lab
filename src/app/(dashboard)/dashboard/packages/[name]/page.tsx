import Image from "next/image";

export default async function CategoryName() {
  return (
    <div className="grid w-full place-items-center overflow-hidden">
      <div className="w-[80%] overflow-hidden">
        <Image
          src="/Chill-Time.svg"
          width={200}
          height={200}
          alt="placeholder"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="text-lg">Select a Package</span>
    </div>
  );
}
