"use client"

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { ReactNode } from "react"

export default function ShadcnProvider({children}: {children: ReactNode}) {
  return (
    <TooltipProvider>
      <Toaster />
      {children}
    </TooltipProvider>
  );
}
