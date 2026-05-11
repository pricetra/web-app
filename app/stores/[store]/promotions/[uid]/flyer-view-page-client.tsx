'use client';

import { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import { FlyerCanvas } from '@/components/flyer/flyer-canvas';
import { Button } from '@/components/ui/button';
import { StorefrontFlyer, StorefrontFlyerDocument, StorefrontFlyerSection } from 'graphql-utils';
import { useQuery } from '@apollo/client/react';

type FlyerViewPageClientProps = {
  flyerBase: StorefrontFlyer;
};

export default function FlyerViewPageClient({ flyerBase }: FlyerViewPageClientProps) {
  // Get detailed flyer data including pages and sections
  const { data: flyerData, loading: flyerLoading } = useQuery(StorefrontFlyerDocument, {
    variables: { uid: flyerBase.uid },
  });

  // TODO: Show products with their stock and price info similar to app/stores/[store]/[branch]/branch-page-client.tsx[202:272]. With the name of the section as the title of the product list.
  // If sections have hero images we can display those as well within the section header with a rounded border.
  return <></>;
};
