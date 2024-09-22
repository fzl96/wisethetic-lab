import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  htmlFor: string;
  value: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, htmlFor, value, icon, ...props }, ref) => {
    return (
      <div className="focus-within:shadow- relative rounded-[5px] border border-checkout-border bg-white transition-all duration-200 ease-in-out focus-within:border-checkout-border-focus focus-within:shadow-checkout-border-shadow">
        <input
          value={value}
          type={type}
          className={cn(
            "peer w-full border-none bg-transparent px-3 pb-[0.9rem] pt-[0.9rem] text-sm outline-none transition-all duration-200 ease-in-out placeholder:text-checkout-secondary-foreground",
            // "focus:pb-[0.4rem] focus:pt-[1.4rem]",
            value && "pb-[0.4rem] pt-[1.4rem]",
            icon && "pr-8",
            className,
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={htmlFor}
          className={cn(
            "absolute left-3 top-3.5 text-[0.75rem] text-checkout-secondary-foreground opacity-0 transition-all duration-200 ease-in-out",
            value && "top-1.5 opacity-100",
          )}
        >
          {label}
        </label>
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-checkout-secondary-foreground">
            {icon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
