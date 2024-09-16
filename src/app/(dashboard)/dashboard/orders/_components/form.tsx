"use client";

import {
  type UpdateOrderParams,
  updateOrderParams,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { updateOrderAction } from "@/server/actions/orders";

const status = [
  { value: "pending", label: "Pending" },
  { value: "process", label: "Process" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function UpdateOrderForm({
  order,
  close,
}: {
  order: {
    id: string;
    status: "pending" | "process" | "completed" | "cancelled" | null;
    notes: string | null;
    contentResult: string | null;
  };
  close: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateOrderParams>({
    resolver: zodResolver(updateOrderParams),
    defaultValues: {
      status: order.status ?? "pending",
      notes: order.notes ?? "",
      contentResult: order.contentResult ?? "",
    },
  });

  const onSubmit = async (values: UpdateOrderParams) => {
    startTransition(async () => {
      const res: {
        error?: string;
        message?: string;
      } = await updateOrderAction(order.id, values);

      if (res.error) {
        toast.error(res.error);
      }
      router.refresh();

      close();
      toast.success(res.message);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 px-4 md:px-0">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? ""}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {status?.map((st) => (
                        <SelectItem key={st.value} value={st.value}>
                          {st.label}
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
              name="contentResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Content Result</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="contentResult"
                      placeholder="Link for the result"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="Additional notes"
                      disabled={isPending}
                      className="min-h-32"
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
