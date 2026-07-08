"use client";
import Footer from "@/components/ui/footer";
import NavbarMain from "@/components/ui/navbar-main";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { PhotoProvider } from "react-photo-view";

export type LayoutProviderProps = {
  children: ReactNode;
  fullScreen?: boolean;
};

export default function LayoutProvider({
  children,
  fullScreen,
}: LayoutProviderProps) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="grow">
        <NavbarMain fullScreen={fullScreen} />

        <div
          className={cn(
            "w-full max-w-full mx-auto relative flex flex-col lg:flex-row gap-10 flex-wrap",
            fullScreen ? "w-full" : "lg:max-w-384 mt-5",
          )}
        >
          <PhotoProvider>{children}</PhotoProvider>
        </div>
      </div>

      <div>
        <Footer disableExtraSpacing={fullScreen} />
      </div>
    </main>
  );
}
