import { db } from "@/server/db";
import { cartItems, carts, users } from "../schema";
import { count, eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
}

export async function getUserById(id: string) {
  // return db.query.users.findFirst({
  //   where: (users, { eq }) => eq(users.id, id),
  // });
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      emailVerified: users.emailVerified,
      cartId: carts.id,
    })
    .from(users)
    .where(eq(users.id, id))
    .innerJoin(carts, eq(users.id, carts.userId));

  if (!user) return undefined;

  const [numberOfItemsInCart] = await db
    .select({
      count: count(),
    })
    .from(cartItems)
    .where(eq(cartItems.cartId, user.cartId));
  // .innerJoin(carts, eq(users.id, carts.userId));

  return {
    ...user,
    cartItemsCount: numberOfItemsInCart?.count ?? 0,
  };
}
