import type { Metadata } from "next";
import {
  ProductSummary,
  ProductSummaryDocument,
  ProductSummaryQuery,
  ProductSummaryQueryVariables,
} from "graphql-utils";
import { fetchGraphql } from "@/lib/graphql-client-ssr";
import ProductPageClient from "./product-page-client";
import { notFound } from "next/navigation";
import { cache } from "react";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { parseIntOrUndefined, serverSideIpAddress } from "@/lib/strings";
import dayjs from "dayjs";
import { isDateExpired } from "@/lib/utils";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{
    stockId?: string;
    sharedBy?: string;
    sharedFrom?: string;
  }>;
};

const cachedFetchProductSummary = cache(
  async (productId: number, stockId?: number) => {
    const { data } = await fetchGraphql<
      ProductSummaryQueryVariables,
      ProductSummaryQuery
    >(ProductSummaryDocument, "query", { productId, stockId });
    if (!data || !data.productSummary) return null;

    return data.productSummary;
  }
);

const DATE_FORMAT = "MMM D, YYYY";

function productSeoTitleAndDescription(p: ProductSummary) {
  const isBrandValid = p.brand.length > 0 || p.brand !== "N/A";
  const saleExpired = p.saleExpiresAt ? isDateExpired(p.saleExpiresAt) : false;

  let title = p.name;
  if (isBrandValid) {
    title += ` by ${p.brand}`;
  }
  if (p?.branch) {
    title += ` at ${p.branch}`;
  }

  let description = p.name;
  if (p.code) {
    description += `. ${p.code} (UPC/PLU/ID)`;
  }
  if (p.store || p.branch) {
    description += `. Sold at ${p.store ?? p.branch}`;
  }
  if (p.address) {
    description += ` (${p.address})`;
  }
  if (p.price) {
    description += ` for ${saleExpired ? p.originalPrice ?? "N/A" : p.price}`;
    if (p.priceCurrencyCode) description += ` ${p.priceCurrencyCode}`;
  }
  if (p.sale && p.sale === true && p.saleExpiresAt && !saleExpired) {
    description += ` on SALE`;
    if (p.originalPrice) {
      description += ` (Was ${p.originalPrice})`;
    }
    description += `, sale expires on ${dayjs(p.saleExpiresAt).format(
      DATE_FORMAT
    )}`;
  }
  if (p.priceCreatedAt) {
    description += `. Price reported on ${dayjs(p.priceCreatedAt).format(
      DATE_FORMAT
    )}`;
  }
  if (p.description && p.description.length > 0) {
    description += `. ${p.description}`;
  }
  return { title, description };
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);

  const { stockId } = await searchParams;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    parsedStockId
  );
  if (!productSummary) return { title: "Product not found - Pricetra" };

  const { title, description } = productSeoTitleAndDescription(productSummary);
  return {
    title: `${title} | Pricetra`,
    description,
    openGraph: {
      type: "article",
      siteName: "Pricetra",
      title: title,
      description,
      publishedTime: productSummary.priceCreatedAt,
      images: productSummary.image,
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

  const { stockId, sharedBy, sharedFrom } = await searchParams;
  const parsedStockId = parseIntOrUndefined(stockId);
  const parsedSharedById = sharedBy ? parseInt(sharedBy, 10) : undefined;

  const productSummary = await cachedFetchProductSummary(parsedProductId);
  if (!productSummary) {
    notFound();
  }

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);

  return (
    <LayoutProvider>
      <ProductPageClient
        productId={parsedProductId}
        stockId={parsedStockId}
        sharedBy={parsedSharedById}
        sharedFrom={sharedFrom}
        ipAddress={ipAddress}
      />
    </LayoutProvider>
  );
}
