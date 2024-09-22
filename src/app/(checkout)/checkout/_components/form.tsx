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
        </div>
      </form>
    </Form>
  );
}
