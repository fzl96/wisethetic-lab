"use client";

import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { PackageWithProducts } from "@/server/db/schema/product";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { RadioGroup } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { NewCartItemParams } from "@/server/db/schema/cart";
import { addToCart as _addToCart } from "@/server/actions/cart";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ChevronUp, ChevronDown } from "lucide-react";

export function CartForm({ pkg }: { pkg: PackageWithProducts }) {
  const { update } = useSession();
  const user = useCurrentUser();

  const { mutate: addToCart, isPending } = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (args: NewCartItemParams) => {
      const res = await _addToCart(args);

      if ("error" in res) {
        throw new Error(res.error);
      }
    },
    onError: (e) => {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Failed to add to cart");
      }
    },
    onSuccess: async () => {
      await update();
      toast.success("Added to cart");
    },
  });
  const [selectedProduct, setSelectedProduct] = useState(pkg.products[0]);
  const [additionalContent, setAdditionalContent] = useState(0);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const total = useMemo(() => {
    const productPrice = selectedProduct?.price ?? 0;
    const additionalContentAmount = isNaN(additionalContent)
      ? 0
      : additionalContent;
    return productPrice + additionalContentAmount * pkg.additionalContentPrice;
  }, [selectedProduct, additionalContent, pkg.additionalContentPrice]);

  return (
    <div>
      <div className="my-5 space-y-2">
        <h3>Select a package</h3>
        <RadioGroup
          className="space-y-4"
          value={selectedProduct}
          onChange={setSelectedProduct}
        >
          {pkg?.products.map((product) => (
            <RadioGroup.Option
              key={product.id}
              value={product}
              className={({ active, checked }) =>
                cn(
                  "relative block cursor-pointer rounded-lg border-2 border-home-border px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                  {
                    "border-primary": active || checked,
                  },
                  // selectedProduct === product && "border-primary",
                )
              }
            >
              <span className="flex w-full items-center">
                <span className="flex w-full flex-col  text-sm">
                  <RadioGroup.Label
                    className="flex justify-between font-medium text-home-foreground"
                    as="span"
                  >
                    <span>{product.name}</span>
                    {currencyFormatter.format(product.price)}
                  </RadioGroup.Label>
                </span>
              </span>
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      <div className="my-5 space-y-2">
        <h3>Add additional content</h3>
        <div className="flex items-center justify-between  text-sm">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setAdditionalContent((prev) => prev + 1)}
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="w-8 bg-transparent text-center outline-none"
              min={0}
              max={100}
              value={additionalContent}
              onBlur={() => {
                if (isNaN(additionalContent)) {
                  setAdditionalContent(0);
                }
              }}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value < 0) {
                  setAdditionalContent(0);
                  return;
                }
                setAdditionalContent(parseInt(e.target.value));
              }}
            />
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() =>
                setAdditionalContent((prev) => {
                  if (prev === 0) return 0;
                  return prev - 1;
                })
              }
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
          <span>
            {currencyFormatter.format(pkg.additionalContentPrice)} / Content
          </span>
        </div>
      </div>
      <div className="mt-10 space-y-4">
        <div className="flex w-full justify-between text-lg font-medium">
          Subtotal:
          <span>{currencyFormatter.format(total)}</span>
        </div>
        <Button
          size="lg"
          className="w-full py-6 disabled:cursor-pointer"
          disabled={isPending || !selectedProduct || !user}
          onClick={() => {
            if (!user?.cartId) {
              toast.error("Please sign in to add to cart");
              return;
            }

            if (!selectedProduct) {
              toast.error("Please select a product");
              return;
            }

            addToCart({
              cartId: user.cartId,
              productId: selectedProduct.id,
              packageId: pkg.id,
              additionalContentQuantity: additionalContent,
            });
          }}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-5 w-5" />
          )}
          Add to Cart
        </Button>
      </div>
      {!user && (
        <div className="mt-5 text-center text-sm">
          Please sign in to add to cart
        </div>
      )}
    </div>
  );
}
