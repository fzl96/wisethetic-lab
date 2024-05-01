import { getProducts } from "@/server/api/products/queries";
import { type PackageId } from "@/server/db/schema/product";
import { CreateProduct, ProductMenu } from "./products/actions";

interface ProductContentProps {
  packageId: PackageId;
}

export default async function ProductContent({
  packageId,
}: ProductContentProps) {
  const products = await getProducts(packageId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-5">
        <p className="text-lg">Contents</p>
        <CreateProduct
          packageId={packageId}
          redirectUrl={`/dashboard/packages/`}
        />
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <ProductMenu
            key={product.id}
            product={product}
            packageId={product.packageId}
          />
        ))}
      </div>
    </div>
  );
}
