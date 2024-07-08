"use client";

import {
  type Product,
  type ProductId,
  type NewProductParams,
  insertProductParams,
  PackageId,
} from "@/server/db/schema/product";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/server/actions/products";

interface PackageFormProps {
  product?: Product;
  productId?: ProductId;
  packageId: PackageId;
  action: "create" | "update" | "delete";
  close?: () => void;
}

export function ProductForm({
  product,
  packageId,
  action,
  close,
}: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewProductParams>({
    resolver: zodResolver(insertProductParams),
    defaultValues: product ?? {
      name: "",
      description: "",
      price: 0,
      packageId: packageId,
    },
  });

  const after = (
    action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    if (close) close();
    router.refresh();
    toast.success(
      `Content ${action === "create" ? "created" : action === "update" ? "updated" : "deleted"}`,
    );
  };
  const onSubmit = async (values: NewProductParams) => {
    let res: { error?: string; message?: string };

    startTransition(async () => {
      if (action === "create") {
        res = await createProductAction(values);
      } else {
        if (!product?.id) return;
        res = await updateProductAction({
          id: product.id,
          ...values,
        });
      }

      after(action, res);
    });
  };

  const onDelete = async (id: ProductId) => {
    startTransition(async () => {
      const res = await deleteProductAction(id);
      after("delete", res);
    });
  };

  if (action === "delete") {
    if (!product?.id) return null;
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => onDelete(product?.id)}
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={close}
        >
          Batal
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 px-4 md:px-0">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Content name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="description"
                      placeholder="Description"
                      value={field.value ?? ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      placeholder="Price"
                      value={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-end flex">
            <Button
              type="submit"
              className="ml-auto w-full text-right md:w-fit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  </span>
                  {"Submitting"}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
