import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg bg-surface-2 px-3 text-sm text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";
