"use client";

import {
  type Package,
  type NewPackageParams,
  type PackageId,
  type Category,
  insertPackageParams,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

import {
  createPackageAction,
  updatePackageAction,
  deletePackageAction,
} from "@/server/actions/packages";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { FileUploader } from "../../_components/file-uploader";

interface PackageFormProps {
  pkg?: Package;
  packageId?: PackageId;
  categories: Category[];
  action: "create" | "update" | "delete";
  close?: () => void;
}

export function PackageForm({
  pkg,
  packageId,
  categories,
  action,
  close,
}: PackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const form = useForm<NewPackageParams>({
    resolver: zodResolver(insertPackageParams),
    defaultValues: pkg ?? {
      name: "",
      image: "",
      description: "",
      categoryId: categories[0]?.id,
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
    router.push("/dashboard/packages");
    router.refresh();
    toast.success(
      `Package ${action === "create" ? "created" : action === "update" ? "updated" : "deleted"}`,
    );
  };
  const onSubmit = async (values: NewPackageParams) => {
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
        res = await createPackageAction({
          ...values,
          image: imgUrl ?? "",
        });
      } else {
        if (!pkg?.id) return;
        res = await updatePackageAction({
          id: pkg.id,
          ...values,
          image: imgUrl ?? pkg.image,
        });
      }

      after(action, res);
    });
  };

  const onDelete = async (id: PackageId) => {
    startTransition(async () => {
      const res = await deletePackageAction(id);
      after("delete", res);
    });
  };

  if (action === "delete") {
    if (!packageId) return null;
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => onDelete(packageId)}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Name</FormLabel>
                  <FormControl>
                    <Input {...field} id="name" placeholder="Package name" />
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
