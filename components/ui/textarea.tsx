import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-[hsl(var(--focus-input)/0.6)] focus-visible:ring-[hsl(var(--focus-input)/0.6)] focus:border-[hsl(var(--focus-input))] focus-visible:border-[hsl(var(--focus-input))] focus-visible:ring-offset-2",
          "active:border-[hsl(var(--focus-input))] focus-within:border-[hsl(var(--focus-input))] transition-colors duration-150",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
