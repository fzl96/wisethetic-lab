import { db } from "@/server/db";
import { currentUser } from "@/lib/auth";

export const getCart = async () => {
  const user = await currentUser();

  if (!user?.cartId) {
    throw new Error("unauthorized");
  }

  const cart = await db.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.id, user.cartId),
    with: {
      items: {
        with: {
          product: {
            with: {
              package: {
                with: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const cartItems = cart?.items.map((item) => ({
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    package: {
      id: item.product.package.id,
      name: item.product.package.name,
      image: item.product.package.image,
      categoryName: item.product.package.category.name,
      additionalContentPrice: item.product.package.additionalContentPrice,
      additionalContentQuantity: item.additionalContentQuantity ?? 0,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    },
  }));

  return {
    id: cart?.id,
    items: cartItems ?? [],
  };
};
