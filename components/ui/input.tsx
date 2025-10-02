import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // base sizing + left/right padding will be applied by callers for icons
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Use design tokens for focus rings and borders so all inputs are consistent
          "focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-[hsl(var(--focus-input)/0.6)] focus-visible:ring-[hsl(var(--focus-input)/0.6)] focus:border-[hsl(var(--focus-input))] focus-visible:border-[hsl(var(--focus-input))] focus:ring-offset-2",
          // active / focus-within states and smooth transitions
          "active:border-[hsl(var(--focus-input))] focus-within:border-[hsl(var(--focus-input))] transition-colors duration-150",
          "[&:not(:placeholder-shown)]:border-[hsl(var(--focus-input))] [&:not(:placeholder-shown)]:bg-gradient-to-r [&:not(:placeholder-shown)]:from-[hsl(var(--focus-input)/0.06)] [&:not(:placeholder-shown)]:to-[hsl(var(--focus-input)/0.02)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
