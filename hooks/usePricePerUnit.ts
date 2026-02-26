import { Product, ProductSimple } from 'graphql-utils';
import { useMemo } from 'react';

export type PricePerUnitType = {
  unit: string;
  value: number;
  amount: number;
};

export default function usePricePerUnit(
  amount: number,
  { quantityType, quantityValue, weightType, weightValue }: Partial<Product | ProductSimple>
): PricePerUnitType | undefined {
  const data = useMemo<PricePerUnitType | undefined>(() => {
    if (quantityType && quantityValue && quantityValue > 1) {
      return {
        unit: quantityType,
        value: quantityValue,
        amount: amount / quantityValue,
      };
    }

    if (weightType && weightValue && weightValue > 0) {
      return {
        unit: weightType,
        value: weightValue,
        amount: amount / weightValue,
      };
    }
    return undefined;
  }, [quantityType, quantityValue, weightType, weightValue, amount]);

  return data;
}
