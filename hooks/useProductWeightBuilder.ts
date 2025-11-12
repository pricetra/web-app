import { useMemo } from 'react';

export type PartialWeightTypes = {
  weightType?: string | null;
  weightValue?: number | null;
  approximateWeight?: boolean | null;
  netWeight?: boolean | null;
};

export default function useProductWeightBuilder(w: PartialWeightTypes, hideNetWeight = false) {
  const weight = useMemo(() => {
    const values = [];
    if (w.approximateWeight) values.push('~');
    if (w.netWeight && !hideNetWeight) values.push('net');
    if (w.weightValue) values.push(w.weightValue);
    if (w.weightType) values.push(w.weightType);
    return values.join(' ');
  }, [w.approximateWeight, w.netWeight, w.weightValue, w.weightType, hideNetWeight]);

  return weight;
}
