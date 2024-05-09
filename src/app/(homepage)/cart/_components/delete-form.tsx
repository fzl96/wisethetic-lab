"use client";

import { CartItemId } from "@/server/db/schema/cart";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteFromCart as _deleteFromCart } from "@/server/actions/cart";

export function DeleteForm({ id }: { id: CartItemId }) {
  const { mutate: deleteFromCart } = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (args: { id: CartItemId }) => {
      await _deleteFromCart(args.id);
    },
  });

  return (
    <div>
      <button
        className="flex items-center gap-1 text-sm"
        onClick={() => deleteFromCart({ id })}
      >
        <Trash2 className="h-3 w-4" />
        Delete
      </button>
    </div>
  );
}
