import { fetchGraphql } from "@/lib/graphql-client-ssr";
import { isDateExpired } from "@/lib/utils";
import dayjs from "dayjs";
import {
  ProductDocument,
  ProductQuery,
  ProductQueryVariables,
  ProductReferrer,
  ProductSummary,
  ProductSummaryBranchInput,
  ProductSummaryDocument,
  ProductSummaryQuery,
  ProductSummaryQueryVariables,
  ProductViewerMetadata,
} from "graphql-utils";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { userAgentFromString } from "next/server";
import { cache } from "react";
import { ProductPageSearchParams } from "./types";

export const cachedFetchProductDetails = cache(
  async (productId: number, jwt?: string) => {
    const { data } = await fetchGraphql<
      ProductQueryVariables,
      ProductQuery
    >(ProductDocument, "query", { productId }, jwt);
    if (!data || !data.product) return null;

    return data.product;
  }
);

export const cachedFetchProductSummary = cache(
  async (
    productId: number,
    stockId?: number,
    branch?: ProductSummaryBranchInput
  ) => {
    const { data } = await fetchGraphql<
      ProductSummaryQueryVariables,
      ProductSummaryQuery
    >(ProductSummaryDocument, "query", { productId, stockId, branch });
    if (!data || !data.productSummary) return null;

    return data.productSummary;
  }
);

const DATE_FORMAT = "MMM D, YYYY";

export function productSeoTitleAndDescription(p: ProductSummary) {
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

export function pageProductMetrics(headerList: ReadonlyHeaders, ipAddress: string, sp: ProductPageSearchParams) {
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

  return {
    referrer,
    metadata,
  }
}
