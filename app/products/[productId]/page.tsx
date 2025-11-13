import type { Metadata } from "next";
import { PRODUCT_SUMMARY_QUERY } from "@/graphql/documents/queries";
import {
  ProductSummaryQuery,
  ProductSummaryQueryVariables,
} from "@/graphql/types/graphql";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import ProductPageClient from "./product-page-client";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ stockId?: string }>;
};

export const cachedFetchProductSummary = cache(async (productId: number) => {
  const { data } = await fetchGraphql<
    ProductSummaryQueryVariables,
    ProductSummaryQuery
  >(PRODUCT_SUMMARY_QUERY, "query", { productId });
  if (!data || !data.productSummary) return null;

  return data.productSummary;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);
  const productSummary = await cachedFetchProductSummary(parsedProductId);
  if (!productSummary) return { title: "Pricetra" };

  const { name, brand, description, image } = productSummary;

  const titleComponents = [name];
  if (brand.length > 0 || brand !== "N/A") {
    titleComponents.push(brand);
  }
  const title = titleComponents.join(" - ");

  return {
    title: `${title} - Pricetra`,
    description,
    openGraph: {
      type: "article",
      siteName: "Pricetra",
      title: title,
      description: description ?? undefined,
      images: image,
      url: `https://pricetra.com/products/${parsedProductId}`,
    },
  };
}

export default async function LandingPageServer({
  params,
  searchParams,
}: Props) {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);
  const { stockId } = await searchParams;
  const parsedStockId = stockId ? parseInt(stockId, 10) : undefined;

  const productSummary = await cachedFetchProductSummary(parsedProductId);
  if (!productSummary) {
    notFound();
  }

  return (
    <ProductPageClient productId={parsedProductId} stockId={parsedStockId} />
  );
}
