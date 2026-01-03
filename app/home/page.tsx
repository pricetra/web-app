import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import HomePageClient from "./home-page-client";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import { redirect } from "next/navigation";

type Params = {
  searchParams: Promise<{ page: string }>;
}

export async function generateMetadata({}: Params): Promise<Metadata> {
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

export default async function AllStoresPageServer({ searchParams }: Params) {
  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);

  const sp = await searchParams;
  if (sp.page && +sp.page > 1) {
    redirect(`/search?page=${sp.page}`)
  } 

  return (
    <LayoutProvider>
      <HomePageClient ipAddress={ipAddress} />
    </LayoutProvider>
  );
}
