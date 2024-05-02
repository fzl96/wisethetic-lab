import { cn } from "@/lib/utils";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-2.5", className)}>{children}</div>
  );
}
