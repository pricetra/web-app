import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import {
  cachedFetchProductSummary,
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
  const parsedProductId = parseInt(productId, 10);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
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
      url: `https://pricetra.com/products/${parsedProductId}/${branch}`,
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

  const parsedProductId = parseInt(productId, 10);
  const sp = await searchParams;
  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    undefined,
    {
      branchSlug: branch,
    },
  );
  if (!productSummary) {
    notFound();
  }
  if (productSummary.branchSlug !== branch) {
    redirect(`/products/${productId}`, RedirectType.replace);
  }

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);
  const { metadata, referrer } = pageProductMetrics(headerList, ipAddress, sp);
  return (
    <LayoutProvider>
      <ProductPage
        productId={parsedProductId}
        stockId={productSummary.stockId ?? undefined}
        metadata={metadata}
        referrer={referrer}
        ipAddress={ipAddress}
        productSummary={productSummary}
      />
    </LayoutProvider>
  );
}
