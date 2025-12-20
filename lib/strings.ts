import { SearchRouteParams } from '@/app/search/search-page-client';
import { Price, Product, ProductWeightComponents, Stock, User } from 'graphql-utils';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { ProductReferrer } from '../../graphql-utils/src/types/graphql';

export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function postgresArrayToArray(rawArray: string): string[] {
  return rawArray.substring(1, rawArray.length - 1).split(',');
}

export function postgresArrayToNumericArray(rawArray: string): number[] {
  const strArray = postgresArrayToArray(rawArray);
  return strArray.map((v) => parseInt(v, 10));
}

export function formatNutrient(value?: number | null): string {
  if (value == null) return '0';

  // Round to 2 decimals max
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function enumToNormalizedString(e: object): string {
  return titleCase(e.toString().split('_').join(' '));
}

export function currencyFormat(v: number): string {
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)
  );
}

export function buildBase64ImageString(picture: { mimeType: string; base64: string }): string {
  return `data:${picture.mimeType};base64,${picture.base64}`;
}

export function getPriceUnit(price: Price): string {
  return price.unitType !== 'item' ? `/ ${price.unitType}` : '';
}

export function getPriceUnitOrEach(price: Price): string {
  const unit = price.unitType === 'item' ? 'ea' : price.unitType;
  return `/ ${unit.substring(0, 2)}`;
}

export function parseWeight(rawWeight: string): ProductWeightComponents {
  const splitWeight = rawWeight.split(' ');
  return {
    weightValue: +splitWeight[0],
    weightType: splitWeight.slice(1).join(' '),
  };
}

export function getIpAddressFromRequestHeaders(headerList: ReadonlyHeaders) {
  return headerList.get("x-forwarded-for")?.split(",")[0] ?? headerList.get("x-real-ip");
}

export function serverSideIpAddress(headerList: ReadonlyHeaders): string {
  let ipAddress =
    getIpAddressFromRequestHeaders(headerList) ?? "46.110.121.165";
  if (process.env.NODE_ENV !== "production") {
    ipAddress = "70.91.104.137";
  }
  return ipAddress
}

export function parseIntOrUndefined(str?: string): number | undefined {
  if (!str) return undefined;

  const parsedVal = parseInt(str);
  if (isNaN(parsedVal)) return undefined;
  return parsedVal;
}

export function validBrand(brand?: string | null): boolean {
  if (!brand) return false;
  if (brand === 'N/A') return false;
  return brand.length > 0;
}

export function searchParamsTitleBuilder(sp: SearchRouteParams, prefix?: string): string {
  const parsedSearchParams = new URLSearchParams(sp);
  let title = prefix ?? '';
  if (parsedSearchParams.size > 0) {
    title += prefix ? ` ` : '';
    if (sp.query && sp.query.length > 0) {
      title += ` "${sp.query}"`;
    }
    if (sp.category && sp.categoryId) {
      title += ` category "${sp.category}"`;
    }
    if (sp.brand) {
      title += ` brand "${sp.brand}"`;
    }
    if (sp.page) {
      const parsedPage = parseInt(sp.page, 10);
      if (!isNaN(parsedPage) && parsedPage > 1) {
        title += ` page ${sp.page}`;
      }
    }
  }
  return title
}

export function objectToBase64<T>(ob: T): string {
  const ob_str = JSON.stringify(ob);
  return btoa(ob_str)
}

export type SocialMediaType = 'facebook' | 'whatsapp' | 'x' | 'nextdoor' | 'other';

export function generateProductShareLink(socialMedia: SocialMediaType, product: Product, stock?: Stock, user?: User) {
  const paramBuilder = new URLSearchParams();
  if (stock) {
    paramBuilder.set("stockId", stock.id.toString());
  }

  const referrer: ProductReferrer = {
    sharedOn: socialMedia,
    sharedFromPlatform: 'web',
  }
  if (user) {
    referrer.sharedByUser = user.id.toString();
  }
  const ref = objectToBase64(referrer);
  paramBuilder.set('ref', ref);

  return `https://pricetra.com/products/${
    product.id
  }?${paramBuilder.toString()}`;
}
