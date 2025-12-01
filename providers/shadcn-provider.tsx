"use client"

import { TooltipProvider } from "@radix-ui/react-tooltip"
import { ReactNode } from "react"

export default function ShadcnProvider({children}: {children: ReactNode}) {
  return <TooltipProvider>
    {children}
  </TooltipProvider>
}
