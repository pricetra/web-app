import {
  FindStoreDocument,
  FindStoreQuery,
  FindStoreQueryVariables,
} from "@/graphql/types/graphql";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

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
  return {
    title,
    openGraph: {
      title,
      url: `https://pricetra.com/stores/${storeData.slug}`,
    },
  };
}

export default async function LandingPageServer({ params }: Props) {
  const { store } = await params;
  const storeData = await cachedStore(store);
  if (!storeData) notFound();

  return <h1>{storeData.name} store page</h1>;
}
