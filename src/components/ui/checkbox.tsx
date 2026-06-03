"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles
        "peer size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // Light theme: unchecked - border, checked - bg-primary
        "border-primary bg-transparent data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // Dark theme: unchecked - white border, checked - bg-primary with white checkmark
        "dark:border-white dark:bg-transparent dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary",
        // Focus and invalid states
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current transition-none",
          // Light theme: checkmark uses primary-foreground
          "text-primary-foreground",
          // Dark theme: checkmark is white
          "dark:text-white"
        )}
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
