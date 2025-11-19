"use client";
import Footer from "@/components/ui/footer";
import NavbarMain from "@/components/ui/navbar-main";
import { ReactNode } from "react";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <main>
      <NavbarMain />

      <div className="container mx-auto mt-5 relative">{children}</div>

      <Footer />
    </main>
  );
}
