import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <Icons.spinner className="h-10 w-10 animate-spin" />
    </div>
  );
}
