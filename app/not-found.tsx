import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404: Page not found'
  }
}

export default function NotFoundPage() {
  return <LayoutProvider>
    <div className="py-10 px-5 text-center w-full max-w-2xl mx-auto">
      <div className="min-h-[30vh] flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl sm:text-3xl font-bold">Page not found.</h1>
        <p className="text-sm sm:text-base">The page you are looking for was either deleted or does not exist. If you are looking for a product or a store, try searching for it.</p>
      </div>
    </div>
  </LayoutProvider>
}
