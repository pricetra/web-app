import { useMemo } from 'react';

import { Maybe, Price } from 'graphql-utils';
import { isSaleExpired } from '@/lib/utils';

export default function useIsSaleExpired(latestPrice?: Maybe<Price>) {
  const isExpired = useMemo(
    () => (latestPrice ? isSaleExpired(latestPrice) : false),
    [latestPrice]
  );
  return isExpired;
}
