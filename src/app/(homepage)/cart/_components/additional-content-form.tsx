"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CartItemId } from "@/server/db/schema/cart";
import { updateCart as _updateCart } from "@/server/actions/cart";
import { Button } from "@/components/ui/button";

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

  const decrease = () => {
    if (quantity === 0) return;

    updateCart({
      id: item.id,
      quantity: quantity - 1,
    });

    setQuantity((prev) => prev - 1);
  };

  const increase = () => {
    updateCart({
      id: item.id,
      quantity: quantity + 1,
    });

    setQuantity((prev) => prev + 1);
  };

  const updateInput = () => {
    if (isNaN(quantity)) {
      setQuantity(0);
      updateCart({
        id: item.id,
        quantity: 0,
      });

      return;
    }

    updateCart({
      id: item.id,
      quantity: quantity,
    });
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className=" flex items-center text-sm text-muted-foreground md:text-base">
        <Button
          disabled={isPending}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          onClick={decrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          disabled={isPending}
          type="number"
          className="w-8 bg-transparent text-center outline-none"
          value={quantity}
          onBlur={updateInput}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value < 0) {
              setQuantity(0);
              return;
            }
            setQuantity(value);
          }}
          min={0}
        />
        <Button
          disabled={isPending}
          size="icon"
          variant="outline"
          className="h-7 w-7"
          onClick={increase}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <span className="ml-2 hidden lg:block ">additional content(s)</span>
        {isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
}
