"use client";

import { useTransition, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type Payment,
  paymentSchema,
  type PaymentParams,
} from "@/server/db/schema/orders";
import { getPaymentTokenAction } from "@/server/actions/orders";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader, CircleAlert } from "lucide-react";

const paymentMethods: {
  value: string;
  name: string;
}[] = [
  {
    value: "credit_card",
    name: "Credit/Debit Card",
  },
  {
    value: "bank_transfer",
    name: "Bank Transfer",
  },
  {
    value: "other_qris",
    name: "QRIS",
  },
];

interface PaymentFormClientProps {
  orderId: string;
  payment?: Payment;
}

export function PaymentFormClient({
  orderId,
  payment,
}: PaymentFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState(payment?.snapToken);
  const form = useForm<PaymentParams>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: payment?.method ?? "credit_card",
    },
  });

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSubmit = async (values: PaymentParams) => {
    startTransition(async () => {
      const res = await getPaymentTokenAction(orderId, values);

      if (!res || !("token" in res) || "error" in res) {
        return;
      }

      const resToken = res.token;
      setToken(resToken);
      // @ts-expect-error ts doesn't know snap is a global variable
      window.snap.pay(resToken);
    });
  };

  const disabled = !!token;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="m-0 gap-0"
                      value={field.value}
                      disabled={disabled}
                    >
                      {paymentMethods.map((method, index) => {
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
                                value={method.value}
                                className="hidden"
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
                                    field.value === method.value &&
                                      "h-[50%] w-[50%]",
                                  )}
                                >
                                  {" "}
                                </div>
                              </div>
                              <div>
                                <span className={cn("text-sm font-normal")}>
                                  {method.name}
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage {...field} />
                  <FormDescription className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4" />
                    Payment method cannot be changed
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              className="hidden w-full bg-[#998373] py-[1.6rem] text-lg md:flex"
              disabled={isPending}
            >
              {isPending && (
                <span>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                </span>
              )}
              Pay
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
