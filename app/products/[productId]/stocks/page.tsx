import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { serverSideIpAddress, slugifyProductName } from "@/lib/strings";
import { cachedFetchProductDetails, fetchAndHandleProduct } from "../utils";
import ProductSocksPageClient from "./client";
import { parsePage } from "@/lib/utils";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { productId } = await params;
  const sp = await searchParams;
  const productSummary = await fetchAndHandleProduct(
    productId,
    undefined,
    undefined,
    sp,
    '/stocks',
  );
  const { page } = sp;
  const parsedPage = parsePage(page);

  const title = `Available stocks for ${productSummary.name} page ${parsedPage}`;
  const description = `View all product availability for ${productSummary.name}, sorted by your location.`;
  const url = `https://pricetra.com/products/${productSummary.id}-${slugifyProductName(productSummary.name)}/stocks`
  return {
    title: `${title} on Pricetra`,
    description,
    openGraph: {
      type: "article",
      siteName: "Pricetra",
      title,
      description,
      images: productSummary.image,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProductSocksPageServer({
  params,
  searchParams,
}: Props) {
  const { productId } = await params;
  const sp = await searchParams;
  const productSummary = await fetchAndHandleProduct(
    productId,
    undefined,
    undefined,
    sp,
    '/stocks',
  );
  const productDetails = await cachedFetchProductDetails(productSummary.id);
  if (!productDetails) {
    notFound();
  }

  const { page } = sp;
  const parsedPage = parsePage(page);

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);

  return (
    <LayoutProvider>
      <ProductSocksPageClient
        product={productDetails}
        ipAddress={ipAddress}
        page={parsedPage}
      />
    </LayoutProvider>
  );
}
