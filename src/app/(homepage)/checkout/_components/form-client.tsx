"use client";

import { type CartExtended } from "@/server/db/schema/cart";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { NewOrderParams, insertOrderParams } from "@/server/db/schema/orders";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createOrderAction } from "@/server/actions/orders";
import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

const locationOptions = [
  {
    value: "online",
    name: "Online",
  },
  {
    value: "cafe a",
    name: "Cafe A",
  },
  {
    value: "cafe b",
    name: "Cafe B",
  },
  {
    value: "cafe c",
    name: "Cafe C",
  },
];

interface CheckoutFormClientProps {
  cart: CartExtended;
}

export function CheckoutFormClient({ cart }: CheckoutFormClientProps) {
  const { update } = useSession();
  const user = useCurrentUser();
  const brandName = localStorage.getItem("brandName");
  const phone = localStorage.getItem("phone");
  const location = localStorage.getItem("location") as
    | "online"
    | "cafe a"
    | "cafe b"
    | "cafe c";
  const returnAddress = localStorage.getItem("returnAddress");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewOrderParams>({
    resolver: zodResolver(insertOrderParams),
    defaultValues: {
      contactName: user?.name ?? "",
      brandName: brandName ?? "",
      phone: phone ?? "",
      location: location ?? null,
      meetingDate: undefined,
      returnAddress: returnAddress ?? "",
    },
  });

  const total = useMemo(() => {
    const contentsTotal = cart.items?.reduce(
      (acc, item) => acc + item.package.product.price,
      0,
    );
    const additionalTotal = cart.items?.reduce(
      (acc, item) =>
        acc +
        item.package.additionalContentPrice *
          item.package.additionalContentQuantity,
      0,
    );

    return contentsTotal + additionalTotal;
  }, [cart.items]);

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const onSubmit = async (values: NewOrderParams) => {
    startTransition(async () => {
      const res = await createOrderAction(values, cart);
      localStorage.setItem("brandName", values.brandName);
      localStorage.setItem("phone", values.phone);
      localStorage.setItem("location", values.location ?? "");
      localStorage.setItem("returnAddress", values.returnAddress ?? "");

      // @ts-expect-error res is either { error: string } or { order }
      router.push(`/checkout/payment/${res.id}`);
      await update();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 grid items-start gap-5 md:grid-cols-7"
      >
        {/* inputs */}
        <div className="flex flex-col gap-5 rounded-xl md:col-span-4">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your name"
                    disabled={isPending}
                    className="rounded-xl border-none bg-home-card-background p-5"
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
                <FormLabel htmlFor={field.name}>Brand Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Your brand name"
                    disabled={isPending}
                    className="rounded-xl border-none bg-home-card-background p-5 outline-none"
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
                <FormLabel htmlFor={field.name}>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Your phone number"
                    disabled={isPending}
                    className="rounded-xl border-none bg-home-card-background p-5 outline-none"
                  />
                </FormControl>
                <FormMessage {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Meeting Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-none bg-home-card-background p-5 outline-none">
                      <SelectValue placeholder="Select a meeting location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-none bg-home-card-background">
                    {locationOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-lg"
                      >
                        {option.name}
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
            name="meetingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor={field.name}>Meeting Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start rounded-xl border-none bg-home-card-background p-5 outline-none",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a Date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="bg-home-card-background"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="returnAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  Product Return Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your return address"
                    className="rounded-xl border-none bg-home-card-background p-5 outline-none "
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  This is the address where we will return the product
                </FormDescription>
                <FormMessage {...field} />
              </FormItem>
            )}
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-5 rounded-xl bg-home-card-background p-7 md:col-span-3">
          <div className="space-y-4 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div>
                    {item.package.product.name}
                    {item.package.additionalContentQuantity ? (
                      <span className="">
                        {" "}
                        + {item.package.additionalContentQuantity} additional
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="grid text-muted-foreground">
                    <span>Package: {item.package.name}</span>
                    <span>Category: {item.package.categoryName}</span>
                  </div>
                </div>
                <span>
                  {currencyFormatter.format(item.package.product.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <div>Total</div>
            <div>{currencyFormatter.format(total)}</div>
          </div>
          <Button className="w-full" disabled={isPending}>
            {isPending && (
              <span>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              </span>
            )}
            Proceed to payment
          </Button>
        </div>
      </form>
    </Form>
  );
}
