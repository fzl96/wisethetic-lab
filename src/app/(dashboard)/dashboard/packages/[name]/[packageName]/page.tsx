import { reverseSlug } from "@/lib/utils";
import { Suspense } from "react";
import { ContentCard } from "../../_components/content-card";
import { CardLoader } from "../../_components/card-loader";

export default async function PackageNamePage({
  params,
}: {
  params: {
    name: string;
    packageName: string;
  };
}) {
  const categoryName = reverseSlug(params.name);
  const pkgName = reverseSlug(params.packageName);

  return (
    <div>
      <Suspense fallback={<CardLoader />}>
        <ContentCard
          categoryName={categoryName}
          packageName={pkgName}
          redirectUrl={params.name}
        />
      </Suspense>
    </div>
  );
}
