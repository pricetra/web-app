import LayoutProvider from "@/providers/layout-provider";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404: Page not found'
  }
}

export default function NotFoundPage() {
  return <LayoutProvider>
    <div className="py-10 text-center w-full max-w-2xl mx-auto">
      <h1 className="text-3xl mb-5 font-bold">Page not found.</h1>
      <p>The page you are looking for was either deleted or does not exist. If you are looking for a product or a store, try searching for it.</p>
    </div>
  </LayoutProvider>
}
