"use client";
import Footer from "@/components/ui/footer";
import NavbarMain from "@/components/ui/navbar-main";
import { ReactNode } from "react";
import { PhotoProvider } from "react-photo-view";

export type LayoutProviderProps = {
  children: ReactNode;
  fullScreen?: boolean;
};

export default function LayoutProvider({ children, fullScreen }: LayoutProviderProps) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="grow">
        <NavbarMain fullScreen={fullScreen} />

        {fullScreen ? (
          <div className="max-w-full relative flex flex-col lg:flex-row gap-0">
            <PhotoProvider>
              {children}
            </PhotoProvider>
          </div>
        ) : (
          <div className="max-w-full sm:container mx-auto mt-5 relative flex flex-col lg:flex-row gap-3">
            <PhotoProvider>
              {children}
            </PhotoProvider>
          </div>
        )}
      </div>

      <div>
        <Footer disableExtraSpacing={fullScreen} />
      </div>
    </main>
  );
}
