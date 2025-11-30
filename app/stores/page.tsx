import type { Metadata } from "next";
import StorePageClient from "./store-page-client";
import LayoutProvider from "@/providers/layout-provider";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Stores - Pricetra";
  const description =
    "Explore prices across hundreds of grocery and retail stores. Compare branches, track product prices, and find the best deals near you.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
