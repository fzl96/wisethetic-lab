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

export const meetingTypeEnum = pgEnum("meeting_type", ["online", "offline"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "bank_transfer",
  "other_qris",
]);
export const locations = pgTable("meeting_location", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  link: text("link"),
});

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

  notes: text("notes"),
  total: integer("total").notNull(),
  status: statusEnum("pending"),
  contentResult: text("content_result"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

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
  productName: text("product_name").notNull(),
  productPrice: integer("product_price").notNull(),
  packageId: text("packageId")
    .notNull()
    .references(() => packages.id),
  packageName: text("package_name").notNull(),
  packagePrice: integer("package_additional_price").notNull(),
  packageImg: text("package_imd"),
  categoryName: text("category_name").notNull(),
  additionalContentQuantity: integer("additional_quantity")
    .notNull()
    .default(1),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const payments = pgTable("payment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: paymentStatusEnum("pending"),
  method: paymentMethodEnum("payment_method"),
  snapToken: text("snap_token"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const returnAddress = pgTable("return_address", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" })
    .unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  additionalInformation: text("additional_information"),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code").notNull(),
  phone: text("phone").notNull(),
});

export const meetings = pgTable("meeting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" })
    .unique(),
  type: meetingTypeEnum("online"),
  date: timestamp("meeting_date", { mode: "date" }).notNull(),
  locationId: text("locationId").references(() => locations.id),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  meeting: one(meetings, {
    fields: [orders.id],
    references: [meetings.orderId],
  }),
  returnAddress: one(returnAddress),
  payment: one(payments),
  orderItems: many(orderItems),
}));

export const returnAddressRelations = relations(returnAddress, ({ one }) => ({
  order: one(orders, {
    fields: [returnAddress.orderId],
    references: [orders.id],
  }),
}));

export const meetingRelations = relations(meetings, ({ one }) => ({
  order: one(orders, {
    fields: [meetings.orderId],
    references: [orders.id],
  }),
  location: one(locations, {
    fields: [meetings.locationId],
    references: [locations.id],
  }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const meetingSchema = z
  .object({
    meetingDate: z.union([
      z.date(), // Accept Date object directly
      z
        .string()
        .refine((value) => !isNaN(Date.parse(value)), {
          message: "Invalid date format",
        })
        .transform((value) => new Date(value)), // Transform string to Date
    ]),
    meetingType: z.enum(["online", "offline"], { message: "Invalid type" }),
    locationId: z.string().nullish(),
  })
  .refine(
    (data) =>
      !data.meetingType || data.meetingType === "online" || data.locationId,
    {
      message: "Location is required for offline meeting",
      path: ["locationId"],
    },
  );

export const returnSchema = z
  .object({
    returnType: z.enum(["yes", "no"], { message: "Option is not valid" }),
    name: z.string().optional(),
    address: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    addressPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.returnType === "yes") {
      if (!data.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "Enter a name",
        });
      }
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Enter an address",
        });
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: "Enter a city",
        });
      }
      if (!data.province) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["province"],
          message: "Enter a province",
        });
      }
      if (!data.postalCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["postalCode"],
          message: "Enter a ZIP / postal code",
        });
      }
      if (!data.addressPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Enter a phone number",
        });
      }
    }
  });

const orderBaseSchema = createSelectSchema(orders).omit(timestamps);
export const insertOrderSchema = createInsertSchema(orders).omit(timestamps);

export const createOrderSchema = z
  .object({
    contactName: z.string().min(1, { message: "Contact name is required" }),
    phone: z.string().min(1, { message: "Phone number is reuqired" }),
    brandName: z.string().min(1, { message: "Brand name is required" }),
  })
  .and(meetingSchema)
  .and(returnSchema);
export type CreateOrderParams = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = insertOrderSchema
  .extend({
    contentResult: z.string().optional(),
    notes: z.string().optional(),
  })
  .omit({
    id: true,
    userId: true,
    total: true,
    phone: true,
    brandName: true,
    contactName: true,
  });
export type UpdateOrderParams = z.infer<typeof updateOrderSchema>;

export const orderIdSchema = orderBaseSchema.pick({ id: true });
export type OrderId = z.infer<typeof orderIdSchema>["id"];

export type Checkout = {
  id: string;
  userId: string;
  contactName: string;
  phone: string;
  brandName: string;
  total: number;
  status: "pending" | "process" | "completed" | "cancelled" | null;
  meeting: typeof meetings.$inferSelect;
  returnAddress?: typeof returnAddress.$inferSelect | null;
};
export const paymentSchema = z.object({
  method: z.enum(["credit_card", "bank_transfer", "other_qris"]),
});

export type PaymentParams = z.infer<typeof paymentSchema>;

export const paymentBaseSchema = createSelectSchema(payments);
export type Payment = z.infer<typeof paymentBaseSchema>;
