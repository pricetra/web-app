import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { parseIntOrUndefined, serverSideIpAddress } from "@/lib/strings";
import { cachedFetchProductSummary, pageProductMetrics, productSeoTitleAndDescription } from "./utils";
import ProductPage from "./components/product-page";
import { ProductPageParams, ProductPageSearchParams } from "./types";

type Props = {
  params: Promise<ProductPageParams>;
  searchParams: Promise<ProductPageSearchParams>;
};

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

export default async function ProductPageServer({
  params,
  searchParams,
}: Props) {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);

  const { stockId, ...sp } = await searchParams;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    parsedStockId
  );
  if (!productSummary) {
    notFound();
  }

  if (stockId && productSummary.branchSlug) {
    const paramBuilder = new URLSearchParams(sp);
    const paramStr = paramBuilder.size > 0 ? `?${paramBuilder.toString()}` : ''
    redirect(`/products/${productId}/${productSummary.branchSlug}${paramStr}`, RedirectType.replace);
  }

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const { metadata, referrer } = pageProductMetrics(headerList, ipAddress, sp);
  return (
    <LayoutProvider>
      <ProductPage
        productId={parsedProductId}
        stockId={parsedStockId}
        referrer={referrer}
        metadata={metadata}
        ipAddress={ipAddress}
        productSummary={productSummary}
      />
    </LayoutProvider>
  );
}
