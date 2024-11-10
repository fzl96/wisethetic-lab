"use client";

import { type Checkout } from "@/server/db/schema/orders";
import { useCurrentUser } from "@/hooks/use-current-user";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input as CustomInput } from "@/app/(checkout)/checkout/_components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/(checkout)/checkout/_components/ui/radio-group";
import { Button } from "@/components/ui/button";
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
} from "@/app/(checkout)/checkout/_components/ui/select";
import { useMemo, useState, useTransition } from "react";
import {
  type CreateOrderParams,
  createOrderSchema,
} from "@/server/db/schema/orders";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { RadioGroupSkeleton } from "@/app/(checkout)/checkout/_components/ui/radio-group-skeleton";
import { DatePicker } from "./date-picker";
import { provinces } from "@/app/(checkout)/checkout/_components/provinces";
import { updateCheckoutAction } from "@/server/actions/orders";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
const returnTypes = [
  {
    value: "no",
    label: "Keep",
  },
  {
    value: "yes",
    label: "Return",
  },
];

type Meeting = {
  date: Date;
  hour: number;
};

type Locations = {
  id: string;
  name: string;
  link: string | null;
  address: string;
};

interface UpdateOrderProps {
  order: Checkout;
}

export function UpdateOrder({ order }: UpdateOrderProps) {
  const router = useRouter();
  const user = useCurrentUser();
  const { update } = useSession();

  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date>(order.meeting.date);
  const [provinceOpen, setProvinceOpen] = useState(false);

  const form = useForm<CreateOrderParams>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      contactName: order.contactName,
      brandName: order.brandName,
      phone: order.phone,
      meetingDate: order.meeting.date,
      meetingType: order.meeting.type,
      locationId: order.meeting.locationId,
      returnType: order.returnAddress ? "yes" : "no",
      name: order.returnAddress?.name,
      address: order.returnAddress?.address,
      address2: order.returnAddress?.additionalInformation ?? "",
      city: order.returnAddress?.city,
      province: order.returnAddress?.province,
      postalCode: order.returnAddress?.postalCode,
      addressPhone: order.returnAddress?.phone,
    },
  });

  const [date, setDate] = useState({
    date: selectedDate?.getDay(),
    month: selectedDate?.getMonth() ? selectedDate.getMonth() + 1 : 1,
    year: selectedDate?.getFullYear(),
  });

  const { data, isLoading } = useQuery<Meeting[]>({
    queryKey: ["meetings", selectedDate],
    queryFn: () =>
      fetch(
        `/api/checkout/meeting/date?date=${date.date}&month=${date.month}&year=${date.year}`,
      ).then((res) => res.json()),
    enabled: !!selectedDate,
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<
    Locations[]
  >({
    queryKey: ["locations"],
    queryFn: () =>
      fetch(`/api/checkout/meeting/locations`).then((res) => res.json()),
    enabled: !!(form.watch("meetingType") === "offline"),
  });

  const meetingDates = useMemo(() => {
    if (!selectedDate) return [];

    const dateFor14 = new Date(selectedDate);
    dateFor14.setHours(14, 0, 0, 0); // Set time to 14:00

    const dateFor20 = new Date(selectedDate);
    dateFor20.setHours(20, 0, 0, 0); // Set time to 20:00

    return [dateFor14, dateFor20];
  }, [selectedDate]);

  const onSubmit = async (values: CreateOrderParams) => {
    startTransition(async () => {
      await updateCheckoutAction(order.id, values);

      router.push(`/checkout/${order.id}/payment`);
      await update();
    });
  };

  return (
    <Form {...form}>
      <form id="hook-form" onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid gap-8">
          <section className="grid grid-cols-1 gap-4">
            <h2 className="text-xl font-semibold">Contact</h2>
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
          <section className="grid gap-4">
            <h2 className="text-xl font-semibold">Meeting</h2>
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setDate={setDate}
              disabled={isLoading}
            />
            {selectedDate && isLoading && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Meeting time</h3>
                <RadioGroupSkeleton />
              </div>
            )}
            {selectedDate && !isLoading && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Meeting time</h3>
                <FormField
                  control={form.control}
                  name="meetingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="m-0 gap-0"
                        >
                          {meetingDates.map((date, index) => {
                            const disabled = data?.some(
                              (item) =>
                                new Date(item.date).getTime() ===
                                  date.getTime() &&
                                new Date(item.date).getTime() !==
                                  new Date(order.meeting.date).getTime(),
                            );
                            return (
                              <FormItem
                                key={index}
                                className={cn(
                                  "transition-all duration-200 ease-in-out",
                                  "relative border-x border-t border-checkout-border last:border-b has-[:checked]:bg-radio-background",
                                  "bg-white first:rounded-t-[5px] first:before:rounded-t-[5px] last:rounded-b-[5px] last:before:rounded-b-[5px]",
                                  "has-[:checked]:before:transition-all has-[:checked]:before:duration-200 has-[:checked]:before:ease-in-out",
                                  "before:pointer-events-none has-[:checked]:before:absolute has-[:checked]:before:z-10 has-[:checked]:before:h-full has-[:checked]:before:w-full has-[:checked]:before:ring-1 has-[:checked]:before:ring-checkout-border-focus has-[:checked]:before:content-['']",
                                )}
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={date.toString()}
                                    className="hidden"
                                    disabled={disabled}
                                  />
                                </FormControl>
                                <FormLabel
                                  className={cn(
                                    "flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-[0.9rem] outline-none",
                                    disabled && "cursor-not-allowed",
                                  )}
                                >
                                  <div className="grid h-4 w-4 place-items-center rounded-full bg-checkout-border-focus">
                                    <div
                                      className={cn(
                                        "h-full w-full rounded-full border border-checkout-border bg-white transition-all duration-200 peer-checked:bg-checkout-border-focus",
                                        new Date(field.value).getTime() ===
                                          date.getTime() && "h-[50%] w-[50%]",
                                      )}
                                    >
                                      {" "}
                                    </div>
                                  </div>
                                  <div>
                                    <span
                                      className={cn(
                                        "text-sm font-normal",
                                        disabled &&
                                          "text-checkout-secondary-foreground",
                                      )}
                                    >
                                      {format(date, "HH:mm")} WIB
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="meetingType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="m-0 gap-0"
                    >
                      {meetingTypes.map((type) => (
                        <FormItem
                          key={type.value}
                          className={cn(
                            "transition-all duration-200 ease-in-out",
                            "relative border-x border-t border-checkout-border last:border-b has-[:checked]:bg-radio-background",
                            "bg-white first:rounded-t-[5px] first:before:rounded-t-[5px] last:rounded-b-[5px] last:before:rounded-b-[5px]",
                            "has-[:checked]:before:transition-all has-[:checked]:before:duration-200 has-[:checked]:before:ease-in-out",
                            "before:pointer-events-none has-[:checked]:before:absolute has-[:checked]:before:z-10 has-[:checked]:before:h-full has-[:checked]:before:w-full has-[:checked]:before:ring-1 has-[:checked]:before:ring-checkout-border-focus has-[:checked]:before:content-['']",
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={type.value}
                              className="sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-[0.9rem] outline-none",
                            )}
                          >
                            <div className="grid h-4 w-4 place-items-center rounded-full bg-checkout-border-focus">
                              <div
                                className={cn(
                                  "h-full w-full rounded-full border border-checkout-border bg-white transition-all duration-200 peer-checked:bg-checkout-border-focus",
                                  field.value === type.value &&
                                    "h-[50%] w-[50%]",
                                )}
                              >
                                {" "}
                              </div>
                            </div>
                            <div className="">
                              <span className="text-sm font-normal">
                                {type.label}
                              </span>
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("meetingType") === "offline" && (
              <div className="grid gap-2">
                <h3 className="text-lg font-bold ">Locations</h3>
                <p className="text-sm text-[hsl(0,0,44%)]">
                  You can choose to meet at one of these locations
                </p>
                {locationsLoading && <RadioGroupSkeleton />}
                {locations && !locationsLoading && (
                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            className="m-0 gap-0"
                          >
                            {locations.map((location) => {
                              return (
                                <FormItem
                                  key={location.id}
                                  className={cn(
                                    "transition-all duration-200 ease-in-out",
                                    "relative border-x border-t border-checkout-border last:border-b has-[:checked]:bg-radio-background",
                                    "bg-white first:rounded-t-[5px] first:before:rounded-t-[5px] last:rounded-b-[5px] last:before:rounded-b-[5px]",
                                    "has-[:checked]:before:transition-all has-[:checked]:before:duration-200 has-[:checked]:before:ease-in-out",
                                    "before:pointer-events-none has-[:checked]:before:absolute has-[:checked]:before:z-10 has-[:checked]:before:h-full has-[:checked]:before:w-full has-[:checked]:before:ring-1 has-[:checked]:before:ring-checkout-border-focus has-[:checked]:before:content-['']",
                                  )}
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={location.id}
                                      className="hidden"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={cn(
                                      "flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-4 py-[0.9rem] outline-none",
                                      "before:absolute before:z-[1] before:border before:border-checkout-border-focus before:opacity-0 before:content-[''] ",
                                    )}
                                  >
                                    <div className="w-full ">
                                      <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                          <p className="font-normal">
                                            {location.name}
                                          </p>
                                          <p className="text-[0.8rem] font-normal text-checkout-secondary-foreground">
                                            {location.address}
                                          </p>
                                        </div>
                                        <Tooltip delayDuration={0}>
                                          <TooltipTrigger asChild>
                                            <span className="z-100 text-checkout-secondary-foreground">
                                              <a
                                                href={
                                                  location.link ??
                                                  "maps.google.com"
                                                }
                                                target="_blank"
                                              >
                                                <Icons.navigation className="h-4 w-4" />
                                              </a>
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Go to map
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </FormLabel>
                                </FormItem>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </section>
          <section className="grid gap-4">
            <h2 className="text-xl font-semibold">Return</h2>
            <p className="text-sm text-[hsl(0,0,44%)]">
              You can choose if you want us to keep or return the product
            </p>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="returnType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="m-0 gap-0"
                      >
                        {returnTypes.map((type) => (
                          <FormItem
                            key={type.value}
                            className={cn(
                              "transition-all duration-200 ease-in-out",
                              "relative border-x border-t border-checkout-border last:border-b has-[:checked]:bg-radio-background",
                              "bg-white first:rounded-t-[5px] first:before:rounded-t-[5px] last:rounded-b-[5px] last:before:rounded-b-[5px]",
                              "has-[:checked]:before:transition-all has-[:checked]:before:duration-200 has-[:checked]:before:ease-in-out",
                              "before:pointer-events-none has-[:checked]:before:absolute has-[:checked]:before:z-10 has-[:checked]:before:h-full has-[:checked]:before:w-full has-[:checked]:before:ring-1 has-[:checked]:before:ring-checkout-border-focus has-[:checked]:before:content-['']",
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={type.value}
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-[0.9rem] outline-none",
                              )}
                            >
                              <div className="grid h-4 w-4 place-items-center rounded-full bg-checkout-border-focus">
                                <div
                                  className={cn(
                                    "h-full w-full rounded-full border border-checkout-border bg-white transition-all duration-200 peer-checked:bg-checkout-border-focus",
                                    field.value === type.value &&
                                      "h-[50%] w-[50%]",
                                  )}
                                >
                                  {" "}
                                </div>
                              </div>
                              <div className="">
                                <span className="text-sm font-normal">
                                  {type.label}
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              {form.watch("returnType") === "yes" && (
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            id="name"
                            htmlFor={field.name}
                            label="Name"
                            placeholder="Name"
                            {...field}
                            disabled={isPending}
                            value={field.value!}
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
                        <FormControl>
                          <CustomInput
                            id="address"
                            htmlFor={field.name}
                            label="Address"
                            placeholder="Address"
                            {...field}
                            disabled={isPending}
                            value={field.value!}
                          />
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            id="address2"
                            htmlFor={field.name}
                            label="Apartment, suite, etc. (optional)"
                            placeholder="Apartment, suite, etc. (optional)"
                            {...field}
                            disabled={isPending}
                            value={field.value!}
                          />
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            id="city"
                            htmlFor={field.name}
                            label="City"
                            placeholder="City"
                            {...field}
                            disabled={isPending}
                            value={field.value!}
                          />
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                  <div className="grid w-full grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel className="sr-only">Province</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            open={provinceOpen}
                            onOpenChange={setProvinceOpen}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  "transition-all duration-200 ease-in-out",
                                  "relative m-0 flex w-full items-center justify-between rounded-[5px] border border-checkout-border bg-white outline-checkout-border-focus",
                                  provinceOpen &&
                                    "border-checkout-border-focus shadow-checkout-border-shadow",
                                )}
                              >
                                <div
                                  className={cn(
                                    "absolute left-3 top-3.5 text-[0.75rem] text-checkout-secondary-foreground opacity-0 transition-all duration-200 ease-in-out",
                                    field.value && "top-1.5 opacity-100",
                                  )}
                                >
                                  <span>Province</span>
                                </div>
                                <div
                                  className={cn(
                                    "px-3 pb-[0.9rem] pt-[0.9rem] text-sm transition-all duration-200 ease-in-out",
                                    field.value && "pb-[0.4rem] pt-[1.4rem]",
                                  )}
                                >
                                  <SelectValue
                                    className=""
                                    placeholder="Province"
                                  />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province, index) => (
                                <SelectItem key={index} value={province}>
                                  {province}
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
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomInput
                              id="postalCode"
                              htmlFor={field.name}
                              label="Postal code"
                              placeholder="Postal code"
                              {...field}
                              disabled={isPending}
                              value={field.value!}
                            />
                          </FormControl>
                          <FormMessage {...field} />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="addressPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            id="addressPhone"
                            htmlFor={field.name}
                            label="Phone"
                            placeholder="Phone"
                            {...field}
                            disabled={isPending}
                            value={field.value!}
                          />
                        </FormControl>
                        <FormMessage {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </section>
          <Button
            className="hidden bg-[#998373] py-[1.6rem] text-lg md:flex"
            disabled={isPending}
          >
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
