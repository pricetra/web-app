import * as ImagePicker from 'expo-image-picker';

import { Price, ProductWeightComponents } from '@/graphql/types/graphql';

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

export function enumToNormalizedString(e: any): string {
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

export function buildBase64ImageString(picture: ImagePicker.ImagePickerAsset): string {
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
