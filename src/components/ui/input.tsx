import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // base sizing + left/right padding will be applied by callers for icons
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // focus ring uses cyan color to match Triple Tech brand; filled inputs get subtle cyan gradient and border
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:border-cyan-400",
          "[&:not(:placeholder-shown)]:border-cyan-400 [&:not(:placeholder-shown)]:bg-gradient-to-r [&:not(:placeholder-shown)]:from-cyan-50 [&:not(:placeholder-shown)]:to-cyan-100",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
