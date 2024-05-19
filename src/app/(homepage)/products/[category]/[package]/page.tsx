import { MaxWidthWrapper } from "@/app/(homepage)/_components/max-width-wrapper";
import { reverseSlug } from "@/lib/utils";
import { Suspense } from "react";
import { ProductContent } from "./_components/content";
import { ContentLoader } from "./_components/loader";

export default async function PackagePage({
  params,
}: {
  params: { category: string; package: string };
}) {
  const category = reverseSlug(params.category);
  const pkgName = reverseSlug(params.package);

  return (
    <MaxWidthWrapper className="mt-14 flex flex-col items-center justify-center px-5 lg:max-w-6xl">
      <div className="flex w-full flex-col gap-10 md:flex-row">
        <Suspense fallback={<ContentLoader />}>
          <ProductContent category={category} pkgName={pkgName} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
