"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Midtrans() {
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
    <div>
      <Button
        className="w-full rounded-xl"
        onClick={() => {
          // @ts-expect-error ts doesn't know snap is a global variable
          window.snap.pay("603fb5ae-ceef-4ae7-aceb-e70c83efb6cd");
        }}
      >
        Select Payment Method
      </Button>
    </div>
  );
}
