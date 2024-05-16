import { timestamp, pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { cartItems } from "./cart";

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

const baseSchema = createSelectSchema(categories).omit(timestamps);
export const insertCategorySchema =
  createInsertSchema(categories).omit(timestamps);
export const insertCategoryParams = baseSchema.extend({}).omit({
  id: true,
});
export const updateCategorySchema = baseSchema;
export const updateCategoryParams = baseSchema.extend({});
export const categoryIdSchema = baseSchema.pick({ id: true });

// Types for category - used to type API request params and within components
export type Category = typeof categories.$inferSelect;
export type CategoryId = z.infer<typeof categoryIdSchema>["id"];
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategorySchema>;

// Packages
export const packages = pgTable("package", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  additionalContentPrice: integer("additionalContentPrice")
    .notNull()
    .default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const packagesRelations = relations(packages, ({ many, one }) => ({
  products: many(products),
  category: one(categories, {
    fields: [packages.categoryId],
    references: [categories.id],
  }),
}));

const packageBaseSchema = createSelectSchema(packages).omit(timestamps);

export const insertPackageSchema =
  createInsertSchema(packages).omit(timestamps);
export const insertPackageParams = packageBaseSchema
  .extend({
    additionalContentPrice: z.coerce.number(),
  })
  .omit({
    id: true,
  });
export const updatePackageSchema = packageBaseSchema;
export const updatePackageParams = packageBaseSchema.extend({});
export const packageIdSchema = packageBaseSchema.pick({ id: true });

// Types for package - used to type API request params and within components
export type Package = typeof packages.$inferSelect;
export type PackageWithCategory = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  additionalContentPrice: number;
  category: {
    id: string;
    name: string;
  };
};
export type PackageWithProducts = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  additionalContentPrice: number;
  products: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    packageId: string;
    price: number;
  }[];
};

export type PackageId = z.infer<typeof packageIdSchema>["id"];
export type NewPackageParams = z.infer<typeof insertPackageParams>;
export type UpdatePackageParams = z.infer<typeof updatePackageSchema>;

// Products
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  packageId: text("packageId")
    .notNull()
    .references(() => packages.id, { onDelete: "cascade" }),
  price: integer("price").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  package: one(packages, {
    fields: [products.packageId],
    references: [packages.id],
  }),
  cartItems: many(cartItems),
}));

const productBaseSchema = createSelectSchema(products).omit(timestamps);

export const insertProductSchema =
  createInsertSchema(products).omit(timestamps);
export const insertProductParams = productBaseSchema
  .extend({
    price: z.coerce.number(),
  })
  .omit({
    id: true,
  });
export const updateProductSchema = productBaseSchema;
export const updateProductParams = productBaseSchema.extend({});
export const productIdSchema = productBaseSchema.pick({ id: true });

// Types for product - used to type API request params and within components
export type Product = typeof products.$inferSelect;
export type ProductId = z.infer<typeof productIdSchema>["id"];
export type NewProductParams = z.infer<typeof insertProductParams>;
export type UpdateProductParams = z.infer<typeof updateProductSchema>;
