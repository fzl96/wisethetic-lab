"use client";

import { CartItemId } from "@/server/db/schema/cart";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { Trash2, Loader } from "lucide-react";
import { deleteFromCart as _deleteFromCart } from "@/server/actions/cart";
import { toast } from "sonner";

export function DeleteForm({ id }: { id: CartItemId }) {
  const { update } = useSession();
  const { mutate: deleteFromCart, isPending } = useMutation({
    mutationKey: ["cart"],
    mutationFn: async (args: { id: CartItemId }) => {
      await _deleteFromCart(args.id);
    },
    onSuccess: async () => {
      toast.success("Item removed from cart");
      await update();
    },
  });

  return (
    <div>
      <button
        disabled={isPending}
        className="flex items-center gap-1 text-sm"
        onClick={() => deleteFromCart({ id })}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-4" />
        )}
        Delete
      </button>
    </div>
  );
}
