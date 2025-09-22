import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Use muted background in light, card/popover background in dark for contrast
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      "dark:bg-card dark:text-card-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  // Active state: use gold CTA color with subtle border and shadow so it stands out in both light & dark
  // stronger active rules; use important where Tailwind utilities may be overridden elsewhere
  "data-[state=active]:bg-[#e2a70f] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-[#d69e0b] data-[state=active]:shadow-sm data-[state=active]:z-10",
  // Ensure the same appearance in dark mode (explicit) and that inactive text adapts
  "dark:data-[state=active]:bg-[#e2a70f] dark:data-[state=active]:text-white dark:data-[state=active]:border dark:data-[state=active]:border-[#d69e0b] dark:data-[state=active]:z-10",
  // ensure text color adapts for inactive state
  "text-muted-foreground dark:text-card-foreground",
  // On hover (non-active) give a soft gold tint to preview the CTA
  "hover:bg-[#e2a70f]/10 hover:text-[#e2a70f] dark:hover:bg-[#e2a70f]/10",
      // ensure focus ring shows clearly
      "focus-visible:ring-2 focus-visible:ring-[#e2a70f]/40",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
