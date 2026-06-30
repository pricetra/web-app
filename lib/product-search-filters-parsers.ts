import { BranchType, ProductSearch } from "graphql-utils";
import { stringToNumber } from "./utils";
import { parseBool } from "./strings";

export function parseSearchFilters(searchParams: URLSearchParams): ProductSearch {
  const filters: ProductSearch = {};

  const query = searchParams.get("query");
  if (query) filters.query = query;

  const brand = searchParams.get("brand");
  if (brand) filters.brand = brand;

  const category = searchParams.get("category");
  if (category) filters.category = category;

  const categoryId = stringToNumber(searchParams.get("categoryId") ?? undefined);
  if (categoryId !== undefined) filters.categoryId = categoryId;

  const storeId = stringToNumber(searchParams.get("storeId") ?? undefined);
  if (storeId !== undefined) filters.storeId = storeId;

  const branchId = stringToNumber(searchParams.get("branchId") ?? undefined);
  if (branchId !== undefined) filters.branchId = branchId;

  const branchIdsStr = searchParams.get("branchIds");
  if (branchIdsStr) {
    const ids = branchIdsStr
      .split(",")
      .map((id) => stringToNumber(id.trim()))
      .filter((id) => id !== undefined) as number[];
    if (ids.length > 0) filters.branchIds = ids;
  }

  const branchType = searchParams.get("branchType");
  if (branchType) filters.branchType = branchType as BranchType;

  const quantity = stringToNumber(searchParams.get("quantity") ?? undefined);
  if (quantity !== undefined) filters.quantity = quantity;

  const weight = searchParams.get("weight");
  if (weight) filters.weight = weight;

  const sale = searchParams.get("sale");
  if (sale !== null) filters.sale = parseBool(sale);

  const showUnavailable = searchParams.get("showUnavailable");
  if (showUnavailable !== null) filters.showUnavailable = parseBool(showUnavailable);

  const sortByPrice = searchParams.get("sortByPrice");
  if (sortByPrice) filters.sortByPrice = sortByPrice;

  // TODO: Handle location parsing if needed
  // const location = searchParams.get("location");
  // if (location) filters.location = JSON.parse(location);

  return filters;
}

export function buildSearchParamsFromFilters(filters: ProductSearch): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set("query", filters.query);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.category) params.set("category", filters.category);
  if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
  if (filters.storeId) params.set("storeId", String(filters.storeId));
  if (filters.branchId) params.set("branchId", String(filters.branchId));
  if (filters.branchIds && filters.branchIds.length > 0) {
    params.set("branchIds", filters.branchIds.map(String).join(","));
  }
  if (filters.branchType) params.set("branchType", filters.branchType);
  if (filters.quantity !== undefined) params.set("quantity", String(filters.quantity));
  if (filters.weight) params.set("weight", filters.weight);
  if (filters.sale !== undefined) params.set("sale", String(filters.sale));
  if (filters.showUnavailable !== undefined) params.set("showUnavailable", String(filters.showUnavailable));
  if (filters.sortByPrice) params.set("sortByPrice", filters.sortByPrice);
  // TODO: Handle location serialization if needed
  // if (filters.location) params.set("location", JSON.stringify(filters.location));

  return params;
}