import {
  Branch,
  BranchDocument,
  BranchQuery,
  BranchQueryVariables,
  Store,
} from "graphql-utils";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import LayoutProvider from "@/providers/layout-provider";
import BranchPageClient from "./branch-page-client";
import { SearchRouteParams } from "@/app/search/search-page-client";
import { searchParamsTitleBuilder } from "@/lib/strings";

const cachedStoreAndBranch = cache(async (store: string, branch: string) => {
  const storeId = parseInt(store, 10);
  const branchId = parseInt(branch, 10);

  const queryVars: BranchQueryVariables = {};
  if (isNaN(storeId)) {
    // store might be a slug
    queryVars.storeSlug = store;
  } else {
    queryVars.storeId = storeId;
  }

  if (isNaN(branchId)) {
    // store might be a slug
    queryVars.branchSlug = branch;
  } else {
    queryVars.branchId = branchId;
  }

  const { data } = await fetchGraphql<BranchQueryVariables, BranchQuery>(
    BranchDocument,
    "query",
    queryVars
  );
  if (!data || !data.findStore) return null;

  return data;
});

type Props = {
  params: Promise<{ store: string; branch: string }>;
  searchParams: Promise<SearchRouteParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { store, branch } = await params;
  const storeData = await cachedStoreAndBranch(store, branch);
  if (!storeData) return {};

  const sp = await searchParams;
  const searchTitle = searchParamsTitleBuilder(sp);
  const title = `${searchTitle !== "" ? `Results for ${searchTitle} at ` : ""}${
    storeData.findBranch.name
  } - Pricetra`;
  const description = `View real-time prices and product availability at ${storeData.findBranch.name} (${storeData.findBranch.address?.fullAddress}) location. Explore deals, compare prices, and shop smarter at this exact store.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pricetra.com/stores/${storeData.findStore.slug}/${storeData.findBranch.slug}`,
    },
  };
}

export default async function StoreBranchPageServer({
  params,
  searchParams,
}: Props) {
  const { store, branch } = await params;
  const storeData = await cachedStoreAndBranch(store, branch);
  if (!storeData) notFound();

  const sp = await searchParams;
  return (
    <LayoutProvider>
      <BranchPageClient
        store={storeData.findStore as Store}
        branch={storeData.findBranch as Branch}
        searchParams={sp}
      />
    </LayoutProvider>
  );
}
