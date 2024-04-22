import { db } from "@/server/db";
import { users } from "../schema";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
}
