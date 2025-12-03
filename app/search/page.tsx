import LayoutProvider from "@/providers/layout-provider";
import SearchPageClient, { SearchRouteParams } from "./search-page-client";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<SearchRouteParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { query } = await searchParams;
  let title = `Search`;
  if (query && query.length > 0) {
    title += ` results for "${query}"`
  }

  return {
    title: `${title} - Pricetra`,
    openGraph: {
      title: title,
    },
  };
}

export default async function SearchPageServer(props: Props) {
  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const searchParams = await props.searchParams;
  return (
    <LayoutProvider>
      <SearchPageClient ipAddress={ipAddress} searchParams={searchParams} />
    </LayoutProvider>
  );
}
