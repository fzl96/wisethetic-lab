"use client";

import { type CartExtended } from "@/server/db/schema/cart";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input as CustomInput } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import {
  type CreateOrderParams,
  createOrderSchema,
} from "@/server/db/schema/orders";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const meetingTypes = [
  {
    value: "online",
    label: "Online",
  },
  {
    value: "offline",
    label: "On person",
  },
];

interface CheckoutFormClientProps {
  cart: CartExtended;
}

export function CheckoutFormClient({ cart }: CheckoutFormClientProps) {
  const user = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const form = useForm<CreateOrderParams>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      contactName: user?.name ?? "",
    },
  });

  const onSubmit = async (values: CreateOrderParams) => {
    // TODO: add the submit logic
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        {/* TODO: Add the form components */}
        <div className="grid gap-8">
          <section className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-bold">Contact</h2>
            <CustomInput
              label="Email"
              htmlFor="email"
              value={user?.email ?? "t@t.com"}
              disabled
            />
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      id="contactName"
                      htmlFor={field.name}
                      label="Name"
                      placeholder="Name"
                      {...field}
                      disabled={isPending}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      id="brandName"
                      htmlFor={field.name}
                      label="Brand name"
                      placeholder="Brand name"
                      {...field}
                      disabled={isPending}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      id="phone"
                      htmlFor={field.name}
                      label="Phone"
                      placeholder="Phone"
                      {...field}
                      disabled={isPending}
                      value={field.value}
                      icon={
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger type="button">
                            <Icons.help className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-40 text-center"
                            side="left"
                          >
                            In case we need to contact you about your order
                          </TooltipContent>
                        </Tooltip>
                      }
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
          </section>
        </div>
      </form>
    </Form>
  );
}
