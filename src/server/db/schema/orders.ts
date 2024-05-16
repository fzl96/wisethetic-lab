import { pgTable, timestamp, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { products, packages } from "./product";
import { timestamps } from "@/lib/utils";

export const statusEnum = pgEnum("order_status", [
  "pending",
  "process",
  "completed",
  "cancelled",
]);

export const locationEnum = pgEnum("location", [
  "cafe a",
  "cafe b",
  "cafe c",
  "online",
]);

export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),

  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  brandName: text("brand_name").notNull(),
  meetingDate: timestamp("meeting_date", { mode: "date" }).notNull(),
  location: locationEnum("online"),
  returnAddress: text("return_address"),

  notes: text("notes"),
  total: integer("total").notNull(),
  status: statusEnum("pending"),
  contentResult: text("content_result"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

const orderBaseSchema = createSelectSchema(orders).omit(timestamps);
export const insertOrderSchema = createInsertSchema(orders).omit(timestamps);
export const insertOrderParams = insertOrderSchema
  .extend({
    returnAddress: z.string().optional(),
  })
  .omit({
    id: true,
    userId: true,
    notes: true,
    total: true,
    status: true,
    contentResult: true,
  });
export const orderIdSchema = orderBaseSchema.pick({ id: true });
export type Order = typeof orders.$inferSelect;
export type OrderId = z.infer<typeof orderIdSchema>["id"];
export type NewOrderParams = z.infer<typeof insertOrderParams>;

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const payments = pgTable("payment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: text("method"),
  status: paymentStatusEnum("pending"),
  snapToken: text("snap_token"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const orderItems = pgTable("order_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  productName: text("product_name"),
  productPrice: integer("product_price"),
  packageId: text("packageId")
    .notNull()
    .references(() => packages.id),
  packageName: text("package_name"),
  packagePrice: integer("package_additional_price"),
  packageImg: text("package_imd"),
  additionalContentQuantity: integer("additional_quantity")
    .notNull()
    .default(1),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsBaseSchema =
  createSelectSchema(orderItems).omit(timestamps);
