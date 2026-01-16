import type { Metadata } from "next";
import {
  ProductReferrer,
  ProductViewerMetadata,
} from "graphql-utils";
import { notFound, redirect, RedirectType } from "next/navigation";
import LayoutProvider from "@/providers/layout-provider";
import { headers } from "next/headers";
import { serverSideIpAddress } from "@/lib/strings";
import { cachedFetchProductSummary, productSeoTitleAndDescription } from "../utils";
import ProductPage from "../components/product-page";
import { userAgentFromString } from "next/server";

type Props = {
  params: Promise<{ productId: string, branch: string }>;
  searchParams: Promise<{
    stockId?: string;
    sharedBy?: string;
    sharedFrom?: string;
    ref?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId, branch } = await params;
  const parsedProductId = parseInt(productId, 10);

  const productSummary = await cachedFetchProductSummary(
    parsedProductId,
    undefined,
    {
        branchSlug: branch,
    }
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

  let referrer: ProductReferrer | undefined;
  if (sp.sharedBy) {
    if (!referrer) referrer = {};
    referrer.sharedByUser = sp.sharedBy;
  }
  if (sp.sharedFrom) {
    if (!referrer) referrer = {};
    referrer.sharedFromPlatform = sp.sharedFrom;
  }
  if (sp.ref) {
    try {
      const raw_ref = atob(sp.ref);
      referrer = JSON.parse(raw_ref) as ProductReferrer;
    } catch {}
  }

  const userAgent = headerList.get('user-agent');
  const { device: deviceOb } = userAgentFromString(userAgent ?? '');
  const deviceComponents: string[] = [];
  if (deviceOb) {
    if (deviceOb.vendor) {
      deviceComponents.push(deviceOb.vendor);
    }
    if (deviceOb.model) {
      deviceComponents.push(deviceOb.model);
    }
  }
  const device = deviceComponents.length > 0 ? deviceComponents.join(" ") : undefined;
  const metadata: ProductViewerMetadata = {
    ipAddress,
    userAgent,
    device,
  }
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
