import type { Metadata } from "next";
import StorePageClient from "./store-page-client";
import LayoutProvider from "@/providers/layout-provider";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Stores - Pricetra";
  return {
    title,
    openGraph: {
      title,
      url: "https://pricetra.com/stores",
    },
  };
}

export default async function AllStoresPageServer() {
  return (
    <LayoutProvider>
      <StorePageClient />
    </LayoutProvider>
  );
}
