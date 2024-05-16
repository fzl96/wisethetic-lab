import { pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { products, packages } from "./product";
import { timestamps } from "@/lib/utils";

export const carts = pgTable("cart", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

const cartBaseSchema = createSelectSchema(carts);
export const insertCartSchema = createInsertSchema(carts);
export const insertCartParams = cartBaseSchema.extend({}).omit({
  id: true,
});
export const cartIdSchema = cartBaseSchema.pick({ id: true });

export type Cart = z.infer<typeof cartBaseSchema>;
export type CartId = z.infer<typeof cartIdSchema>["id"];
export type NewCartParams = z.infer<typeof insertCartParams>;
export type CartExtended = {
  id: string | undefined;
  items: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    package: {
      id: string;
      name: string;
      image: string | null;
      additionalContentPrice: number;
      additionalContentQuantity: number;
      categoryName: string;
      product: {
        id: string;
        name: string;
        price: number;
      };
    };
  }[];
};

export const cartItems = pgTable("cart_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  cartId: text("cartId")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  packageId: text("packageId")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  additionalContentQuantity: integer("additional_quantity")
    .notNull()
    .default(1),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));

const cartItemBaseSchema = createSelectSchema(cartItems).omit(timestamps);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertCartItemParams = cartItemBaseSchema.extend({}).omit({
  id: true,
});
export const cartItemIdSchema = cartItemBaseSchema.pick({ id: true });

export type CartItem = z.infer<typeof cartItemBaseSchema>;
export type CartItemId = z.infer<typeof cartItemIdSchema>["id"];
export type NewCartItemParams = z.infer<typeof insertCartItemParams>;
export type UpdateCartItemParams = z.infer<typeof insertCartItemParams>;
