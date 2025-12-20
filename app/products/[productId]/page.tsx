import type { Metadata } from "next";
import {
  ProductReferrer,
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
    ref?: string;
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
  // const isBrandValid = validBrand(p.brand);
  const saleExpired = p.saleExpiresAt ? isDateExpired(p.saleExpiresAt) : false;

  let title = p.name;
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

  const sp = await searchParams
  const { stockId } = sp;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    parsedStockId
  );
  if (!productSummary) return { title: "Product not found - Pricetra" };

  const { title, description } = productSeoTitleAndDescription(productSummary);
  const urlParamBuilder = new URLSearchParams(sp);
  const urlParamString = urlParamBuilder.size > 0 ? `?${urlParamBuilder.toString()}` : '';
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
      url: `https://pricetra.com/products/${parsedProductId}${urlParamString}`,
    },
  };
}

export default async function LandingPageServer({
  params,
  searchParams,
}: Props) {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);

  const { stockId, sharedBy, sharedFrom, ref } = await searchParams;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    parsedStockId
  );
  if (!productSummary) {
    notFound();
  }

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);

  let referrer: ProductReferrer | undefined;
  if (sharedBy) {
    if (!referrer) referrer = {};
    referrer.sharedByUser = sharedBy;
  }
  if (sharedFrom) {
    if (!referrer) referrer = {};
    referrer.sharedFromPlatform = sharedFrom;
  }
  if (ref) {
    try {
      const raw_ref = atob(ref);
      referrer = JSON.parse(raw_ref) as ProductReferrer;
    } catch {}
  }

  return (
    <LayoutProvider>
      <ProductPageClient
        productId={parsedProductId}
        stockId={parsedStockId}
        referrer={referrer}
        ipAddress={ipAddress}
        productSummary={productSummary}
      />
    </LayoutProvider>
  );
}
