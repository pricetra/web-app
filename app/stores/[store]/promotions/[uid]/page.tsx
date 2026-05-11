import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import {
  StorefrontFlyer,
  StorefrontFlyerSimpleDocument,
  StorefrontFlyerSimpleQuery,
  StorefrontFlyerSimpleQueryVariables,
} from "graphql-utils";
import { cache } from "react";
import { createCloudinaryUrl } from "@/lib/files";
import FlyerViewPageClient from "./flyer-view-page-client";

const cachedFlyerSimple = cache(async (uid: string) => {
  const queryVars: StorefrontFlyerSimpleQueryVariables = {
    uid,
  };

  const { data } = await fetchGraphql<
    StorefrontFlyerSimpleQueryVariables,
    StorefrontFlyerSimpleQuery
  >(StorefrontFlyerSimpleDocument, "query", queryVars);
  if (!data || !data.storefrontFlyerSimple) return null;

  return data.storefrontFlyerSimple;
});

interface Props {
  params: Promise<{
    store: string;
    uid: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store, uid } = await params;
  const flyerData = await cachedFlyerSimple(uid);
  if (!flyerData || !flyerData.store) return {};

  const title = `${flyerData.title} - ${flyerData.branch?.name ?? flyerData.store.name} | Pricetra`;
  const description =
    flyerData.description ??
    `Discover the latest promotions and deals in this flyer. Explore discounts on popular products at ${flyerData.branch?.name ?? flyerData.store.name}. Don't miss out on these exclusive offers!`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: flyerData.flyerImageId
        ? createCloudinaryUrl(flyerData.flyerImageId)
        : undefined,
      url: `https://pricetra.com/stores/${store}/promotions/${uid}`,
    },
  };
}

export default async function FlyerViewPage({ params }: Props) {
  const { store, uid } = await params;
  const flyerData = await cachedFlyerSimple(uid);
  if (!flyerData || !flyerData.store) notFound();
  if (flyerData.store.slug !== store) {
    notFound();
  }

  return <FlyerViewPageClient flyerBase={flyerData as StorefrontFlyer} />;
}
