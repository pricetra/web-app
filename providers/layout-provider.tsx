"use client";
import Footer from "@/components/ui/footer";
import NavbarMain from "@/components/ui/navbar-main";
import { ReactNode } from "react";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <main>
      <NavbarMain />

      <div className="max-w-full sm:container mx-auto mt-5 relative flex flex-col lg:flex-row gap-3">
        {children}
      </div>

      <Footer />
    </main>
  );
}
