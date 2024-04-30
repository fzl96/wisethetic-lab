"use client";

import {
  type Category,
  type NewCategoryParams,
  type CategoryId,
  insertCategoryParams,
} from "@/server/db/schema/product";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/server/actions/categories";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { FileUploader } from "../../_components/file-uploader";

interface CategoryFormProps {
  category?: Category;
  categoryId?: CategoryId;
  action: "create" | "update" | "delete";
  close?: () => void;
}

export function CategoryForm({
  category,
  categoryId,
  action,
  close,
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadProgress: (progress) => {
      setProgress(progress);
    },
  });

  const form = useForm<NewCategoryParams>({
    resolver: zodResolver(insertCategoryParams),
    defaultValues: category ?? {
      name: "",
      image: "",
      description: "",
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
    router.push("/dashboard/categories");
    router.refresh();
    toast.success(
      `Category ${action === "create" ? "created" : action === "update" ? "updated" : "deleted"}`,
    );
  };
  const onSubmit = async (values: NewCategoryParams) => {
    let res: { error?: string; message?: string };

    startTransition(async () => {
      let imgUrl;
      if (files.length > 0) {
        const uploadedImage = await startUpload(files);

        if (uploadedImage) {
          imgUrl = uploadedImage[0]?.url;
        }
      }

      if (action === "create") {
        res = await createCategoryAction({
          ...values,
          image: imgUrl ?? "",
        });
      } else {
        if (!category?.id) return;
        res = await updateCategoryAction({
          id: category.id,
          ...values,
          image: imgUrl ?? category.image,
        });
      }

      after(action, res);
    });
  };

  const onDelete = async (id: CategoryId) => {
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      after("delete", res);
    });
  };

  if (action === "delete") {
    if (!categoryId) return null;
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => onDelete(categoryId)}
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
                      placeholder="Category name"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      onFieldChange={field.onChange}
                      files={files}
                      imgUrl={field.value ?? ""}
                      setFiles={setFiles}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <Progress value={progress} />
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
                  {isUploading ? "Uploading image" : "Submitting"}
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
