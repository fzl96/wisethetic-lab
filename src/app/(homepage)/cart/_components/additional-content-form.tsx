"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CartItemId } from "@/server/db/schema/cart";
import { updateCart as _updateCart } from "@/server/actions/cart";

type Item = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  package: {
    id: string;
    name: string;
    image: string | null;
    additionalContentPrice: number;
    additionalContentQuantity: number;
    product: {
      id: string;
      name: string;
      price: number;
    };
  };
};

export function AdditionalContentForm({ item }: { item: Item }) {
  const { mutate: updateCart, isPending } = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (args: { id: CartItemId; quantity: number }) => {
      await _updateCart(args.id, args.quantity);
    },
  });
  const [quantity, setQuantity] = useState<number>(
    item.package.additionalContentQuantity,
  );

  const same = useMemo(() => {
    return item.package.additionalContentQuantity === quantity;
  }, [quantity, item]);

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className=" flex items-center text-sm text-muted-foreground md:text-base">
        <Plus className="h-4 w-4" />
        <input
          type="number"
          className="w-10 bg-transparent outline-none"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min={0}
        />
        additional
        <span className="hidden lg:block">content(s)</span>
      </div>
      {!same && (
        <button
          className="ml-2 w-fit text-sm text-home-foreground"
          onClick={() =>
            updateCart({
              id: item.id,
              quantity: isNaN(quantity) ? 0 : quantity,
            })
          }
          disabled={isPending}
        >
          Update cart
        </button>
      )}
    </div>
  );
}
