import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { parseIntOrUndefined, serverSideIpAddress } from "@/lib/strings";
import { cachedFetchProductSummary, fetchAndHandleProduct, pageProductMetrics, productSeoTitleAndDescription } from "./utils";
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

  const sp = await searchParams
  const { stockId } = sp;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await cachedFetchProductSummary(
    productId,
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
      url: `https://pricetra.com/products/${productId}`,
    },
  };
}

export default async function ProductPageServer({
  params,
  searchParams,
}: Props) {
  const { productId } = await params;

  const { stockId, ...sp } = await searchParams;
  const parsedStockId = parseIntOrUndefined(stockId);

  const productSummary = await fetchAndHandleProduct(
    productId,
    parsedStockId,
    undefined,
    sp,
  );

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const { metadata, referrer } = pageProductMetrics(headerList, ipAddress, sp);
  return (
    <LayoutProvider>
      <ProductPage
        productId={productSummary.id}
        stockId={parsedStockId}
        referrer={referrer}
        metadata={metadata}
        ipAddress={ipAddress}
        productSummary={productSummary}
      />
    </LayoutProvider>
  );
}
