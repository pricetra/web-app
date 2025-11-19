import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import HomePageClient from "./home-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Pricetra";
  return {
    title,
    openGraph: {
      title,
      url: "https://pricetra.com/home",
    },
  };
}

export default async function AllStoresPageServer() {
  return (
    <LayoutProvider>
      <HomePageClient />
    </LayoutProvider>
  );
}
