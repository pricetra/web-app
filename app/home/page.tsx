import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import HomePageClient from "./home-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Browse - Pricetra";
  const description =
    "Explores prices across stores near you. Shop smarter and save money today.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
