import { fetchGraphql } from "@/lib/graphql-client-ssr";
import { isDateExpired } from "@/lib/utils";
import dayjs from "dayjs";
import {
  ProductSummary,
  ProductSummaryBranchInput,
  ProductSummaryDocument,
  ProductSummaryQuery,
  ProductSummaryQueryVariables,
} from "graphql-utils";
import { cache } from "react";

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
