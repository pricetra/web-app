import {
  FindStoreDocument,
  FindStoreQuery,
  FindStoreQueryVariables,
  Store,
} from "graphql-utils";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import SelectedStorePageClient from "./selected-store-page-client";
import LayoutProvider from "@/providers/layout-provider";

const cachedStore = cache(async (store: string) => {
  const storeId = parseInt(store, 10);
  const queryVars: FindStoreQueryVariables = {};
  if (isNaN(storeId)) {
    // store might be a slug
    queryVars.storeSlug = store;
  } else {
    queryVars.storeId = storeId;
  }

  const { data } = await fetchGraphql<FindStoreQueryVariables, FindStoreQuery>(
    FindStoreDocument,
    "query",
    queryVars
  );
  if (!data || !data.findStore) return null;

  return data.findStore;
});

type Props = {
  params: Promise<{ store: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) return {};

  const title = `${storeData.name} - Pricetra`;
  const description = `Discover products and prices at ${storeData.name} stores near you. Browse nearby branches, discover popular products, and compare prices to get the best deals.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://pricetra.com/stores/${storeData.slug}`,
    },
  };
}

export default async function SelectedStorePageServer({ params }: Props) {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) notFound();

  return (
    <LayoutProvider>
      <SelectedStorePageClient store={storeData as Store} />
    </LayoutProvider>
  );
}
