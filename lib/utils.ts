import { type ClassValue, clsx } from 'clsx';
import convert from 'convert-units';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

import { postgresArrayToNumericArray } from './strings';

import { Category, Price, Product } from 'graphql-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_DELIM = ' > ';

/**
 * This method creates an array with the parent and all it's child categories.
 * It uses the `path` and `expandedPathname` to create this list
 * @param category
 * @returns The parent category and all the nested child categories
 */
export function categoriesFromChild(category: Category): Category[] {
  const path = postgresArrayToNumericArray(category.path);
  const categoryNames = category.expandedPathname.split(CATEGORY_DELIM);
  const categories: Category[] = [];
  for (let i = 0; i < path.length; i++) {
    categories.push({
      id: path[i],
      path: `{${[...path].splice(0, i + 1).join(',')}}`,
      name: categoryNames[i],
      expandedPathname: [...categoryNames].splice(0, i + 1).join(CATEGORY_DELIM),
      depth: i + 1,
    });
  }
  return categories;
}

export function diffObjects<T extends Record<string, unknown>>(obj1: T, obj2: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj1) {
    if (!obj1.hasOwnProperty(key)) continue;
    if (JSON.stringify(obj1[key]) === JSON.stringify(obj2[key])) continue;
    result[key] = obj1[key];
  }
  return result;
}

export function toPrecision(n: number, p: number): string {
  return parseFloat(n < 1 ? n.toFixed(p - 1) : n.toPrecision(p)).toString();
}

export function metersToMiles(m: number) {
  return toPrecision(convert(m).from('m').to('mi'), 2);
}

export function incompleteProductFields(product: Product): string[] {
  const fields: string[] = [];
  if (product.name.trim() === '') {
    fields.push('name');
  }
  if (product.brand.trim() === '') {
    fields.push('brand');
  }
  if (product.categoryId.toString() === '0' || product.categoryId.toString() === '842') {
    fields.push('category');
  }
  return fields;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDateExpired(date: any) {
  return dayjs(date).isBefore(new Date());
}

export function isSaleExpired(price: Price) {
  return isDateExpired(price.expiresAt);
}

export function toBoolean(value?: string): boolean {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

export function stringToNumber(value?: string): number | undefined {
  if (!value) return undefined;

  const numVal = parseInt(value, 10);
  if (isNaN(numVal)) return undefined;
  return numVal;
}

export function extractUndefined(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.toLowerCase() === String(undefined)) return undefined;
  return value;
}

export function getRandomElement(arr: unknown[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

