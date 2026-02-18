"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"


function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input   inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-300 ease-in-out outline-none  focus-visible:ring-ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50 relative",
        className
      )}
      {...props}
    >
        <Moon 
            className={cn(
                'h-4 w-4 absolute z-[1000] top-[10px] left-[10px] stroke-gray-600 fill-white transition-opacity duration-300 ease-in-out', 'data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0'
            )}
        />
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block h-7 w-7 rounded-full ring-0 shadow-lg transition-transform duration-300 ease-in-out data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
        )}
      />
      <Sun 
            className={cn(
                'h-4 w-4 absolute z-[1000] top-[10px] right-[19px] stroke-gray-600 fill-black transition-opacity duration-300 ease-in ease-in-out', 'data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100'
            )}
        />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
