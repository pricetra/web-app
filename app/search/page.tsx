import LayoutProvider from "@/providers/layout-provider";
import SearchPageClient, { SearchRouteParams } from "./search-page-client";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<SearchRouteParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const parsedSearchParams = new URLSearchParams(sp);
  let title = `Search`;
  if (parsedSearchParams.size > 0) {
    title += ` `;
    if (sp.query && sp.query.length > 0) {
      title += ` "${sp.query}"`;
    }
    if (sp.category && sp.categoryId) {
      title += ` category "${sp.category}"`;
    }
    if (sp.brand) {
      title += ` brand "${sp.brand}"`;
    }
    if (sp.page) {
      const parsedPage = parseInt(sp.page, 10);
      if (!isNaN(parsedPage) && parsedPage > 1) {
        title += ` page ${sp.page}`;
      }
    }
  }
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
