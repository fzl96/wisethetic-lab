import { db } from "@/server/db";
import { carts, users } from "../schema";
import { eq } from "drizzle-orm";

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
  // .innerJoin(carts, eq(users.id, carts.userId));

  return user;
}
