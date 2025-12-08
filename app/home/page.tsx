import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import HomePageClient from "./home-page-client";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Browse Pricetra";
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
  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  return (
    <LayoutProvider>
      <HomePageClient ipAddress={ipAddress} />
    </LayoutProvider>
  );
}
