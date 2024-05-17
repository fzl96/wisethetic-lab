"use client";

import { useEffect } from "react";
import { MaxWidthWrapper } from "@/app/(homepage)/_components/max-width-wrapper";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface RenderPaymentProps {
  order: {
    id: string;
    total: number;
    createdAt: Date;
  };
  token: string;
}

export function RenderPayment({ order, token }: RenderPaymentProps) {
  const formatCurrency = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
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

  return (
    <MaxWidthWrapper className="mt-20 min-h-screen space-y-5 px-10">
      <h1 className="font-accent text-lg">Order Payment</h1>
      <div className="grid place-items-center rounded-xl bg-home-card-background p-8">
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">ORDER ID:</span>
            <span className="uppercase">{order.id}</span>
          </div>
          <Separator orientation="vertical" className="h-13 w-[2px]" />
          <div className="flex flex-col items-center text-sm">
            <span className="text-muted-foreground">DATE</span>
            {order && (
              <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
            )}
          </div>
          <Separator orientation="vertical" className="h-13 w-[2px]" />
          <div className="flex flex-col items-center text-sm">
            <span className="text-muted-foreground">TOTAL</span>
            <span>{order && formatCurrency.format(order.total)}</span>
          </div>
        </div>
      </div>
      <Button
        className="w-full rounded-xl"
        onClick={() => {
          // @ts-expect-error ts doesn't know snap is a global variable
          window.snap.pay(token);
        }}
      >
        Select Payment Method
      </Button>
    </MaxWidthWrapper>
  );
}
