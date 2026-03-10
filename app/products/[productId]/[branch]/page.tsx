import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import {
  cachedFetchProductSummary,
  fetchAndHandleProduct,
  pageProductMetrics,
  productSeoTitleAndDescription,
} from "../utils";
import ProductPage from "../components/product-page";
import { ProductPageParams, ProductPageSearchParams } from "../types";

type Props = {
  params: Promise<ProductPageParams>;
  searchParams: Promise<ProductPageSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId, branch } = await params;

  const productSummary = await cachedFetchProductSummary(
    productId,
    undefined,
    {
      branchSlug: branch,
    },
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
      url: `https://pricetra.com/products/${productId}/${branch}`,
    },
  };
}

export default async function ProductBranchPageServer({
  params,
  searchParams,
}: Props) {
  const { productId, branch } = await params;
  if (!branch) {
    notFound();
  }

  const sp = await searchParams;
  delete sp.stockId;
  const productSummary = await fetchAndHandleProduct(productId, undefined, { branchSlug: branch }, sp);

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const { metadata, referrer } = pageProductMetrics(headerList, ipAddress, sp);
  return (
    <LayoutProvider>
      <ProductPage
        productId={productSummary.id}
        stockId={productSummary.stockId ?? undefined}
        metadata={metadata}
        referrer={referrer}
        ipAddress={ipAddress}
        productSummary={productSummary}
      />
    </LayoutProvider>
  );
}
