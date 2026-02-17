"use client";
import Footer from "@/components/ui/footer";
import NavbarMain from "@/components/ui/navbar-main";
import { ReactNode } from "react";
import { PhotoProvider } from "react-photo-view";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="grow">
        <NavbarMain />

        <div className="max-w-full sm:container mx-auto mt-5 relative flex flex-col lg:flex-row gap-3">
          <PhotoProvider>
            {children}
          </PhotoProvider>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </main>
  );
}
