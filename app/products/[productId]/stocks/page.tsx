import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import { cachedFetchProductDetails } from "../utils";
import ProductSocksPageClient from "./client";
import { parsePage } from "@/lib/utils";

type Props = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);

  const productDetails = await cachedFetchProductDetails(parsedProductId);
  if (!productDetails) return { title: "Product not found - Pricetra" };

  const { page } = await searchParams;
  const parsedPage = parsePage(page);

  const title = `Available stocks for ${productDetails.name} page ${parsedPage}`;
  const description = `View all product availability for ${productDetails.name}, sorted by your location.`;
  return {
    title: `${title} on Pricetra`,
    description,
    openGraph: {
      type: "article",
      siteName: "Pricetra",
      title,
      description,
      images: productDetails.image,
      url: `https://pricetra.com/products/${parsedProductId}/stocks`,
    },
  };
}

export default async function ProductSocksPageServer({ params, searchParams }: Props) {
  const { productId } = await params;
  const parsedProductId = parseInt(productId, 10);

  const productDetails = await cachedFetchProductDetails(parsedProductId);
  if (!productDetails) {
    notFound();
  }

  const { page } = await searchParams;
  const parsedPage = parsePage(page);

  const headerList = await headers();
  const ipAddress = serverSideIpAddress(headerList);

  return (
    <LayoutProvider>
      <ProductSocksPageClient product={productDetails} ipAddress={ipAddress} page={parsedPage} />
    </LayoutProvider>
  );
}
