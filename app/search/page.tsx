import LayoutProvider from "@/providers/layout-provider";
import SearchPageClient, { SearchRouteParams } from "./search-page-client";
import { headers } from "next/headers";
import { searchParamsTitleBuilder, serverSideIpAddress } from "@/lib/strings";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<SearchRouteParams>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const title = searchParamsTitleBuilder(sp, "Search");
  const description =
    "Search products, brands, categories, stores, UPCs, locations, or sale near you. Track prices, save money using Pricetra.";

  return {
    title: `${title} - Pricetra`,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SearchPageServer(props: Props) {
  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const searchParams = await props.searchParams;
  if (searchParams.query === "") searchParams.query = undefined;
  return (
    <LayoutProvider>
      <SearchPageClient ipAddress={ipAddress} searchParams={searchParams} />
    </LayoutProvider>
  );
}
