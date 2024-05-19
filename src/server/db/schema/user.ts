import {
  timestamp,
  pgEnum,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { orders } from "./orders";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: roleEnum("role").default("USER").notNull(),
});

export const updateUserNameParams = z.object({
  name: z.string().min(3).max(50),
});
export type UpdateUserNameParams = z.infer<typeof updateUserNameParams>;

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.email, vt.token] }),
  }),
);

export const passwordResetToken = pgTable(
  "passwordResetToken",
  {
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (prt) => ({
    compoundKey: primaryKey({ columns: [prt.email, prt.token] }),
  }),
);
