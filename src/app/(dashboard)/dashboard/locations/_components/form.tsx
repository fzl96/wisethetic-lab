"use client";

import {
  type Location,
  type AddLocationParams,
  addLocationSchema,
} from "@/server/db/schema/orders";

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
  addLocationAction,
  updateLocationAction,
  deleteLocationAction,
} from "@/server/actions/locations";

interface LocationFormProps {
  location?: Location;
  locationId?: string;
  action: "create" | "update" | "delete";
  close?: () => void;
}

export function LocationForm({
  location,
  locationId,
  action,
  close,
}: LocationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddLocationParams>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: location ?? {
      name: "",
      address: "",
      link: "",
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
    router.push("/dashboard/locations");
    router.refresh();
    toast.success(
      `Locations ${action === "create" ? "added" : action === "update" ? "updated" : "deleted"}`,
    );
  };
  const onSubmit = async (values: AddLocationParams) => {
    let res: { error?: string; message?: string };

    startTransition(async () => {
      if (action === "create") {
        res = await addLocationAction(values);
      } else {
        if (!location?.id) return;
        res = await updateLocationAction(location.id, values);
      }

      after(action, res);
    });
  };

  const onDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteLocationAction(id);
      after("delete", res);
    });
  };

  if (action === "delete") {
    if (!locationId) return null;
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          disabled={isPending}
          onClick={() => onDelete(locationId)}
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
                      placeholder="Location name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="address"
                      placeholder="Location address"
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
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="link"
                      placeholder="Map link"
                      value={field.value ?? ""}
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
                  Submitting
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
