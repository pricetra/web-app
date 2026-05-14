'use client';
import { StorefrontFlyer, StorefrontFlyerDocument } from 'graphql-utils';
import { useQuery } from '@apollo/client/react';

type FlyerViewPageClientProps = {
  flyerBase: StorefrontFlyer;
};

export default function FlyerViewPageClient({ flyerBase }: FlyerViewPageClientProps) {
  // Get detailed flyer data including pages and sections
  const { data, loading } = useQuery(StorefrontFlyerDocument, {
    variables: { uid: flyerBase.uid },
  });

  if (loading || !data) {
    return <div className="text-center py-12">Loading flyer...</div>;
  }

  // TODO: Show products with their stock and price info similar to app/stores/[store]/[branch]/branch-page-client.tsx[202:272]. With the name of the section as the title of the product list.
  // If sections have hero images we can display those as well within the section header with a rounded border.
  return <></>;
};
