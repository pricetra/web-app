"use client";
import { StorefrontFlyer, StorefrontFlyerDocument } from "graphql-utils";
import { useQuery } from "@apollo/client/react";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect } from "react";

type FlyerViewPageClientProps = {
  flyer: StorefrontFlyer;
};

export default function FlyerViewPageClient({
  flyer,
}: FlyerViewPageClientProps) {
  // Get detailed flyer data including pages and sections
  const { data, loading } = useQuery(StorefrontFlyerDocument, {
    variables: { uid: flyer.uid },
  });
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();

  useLayoutEffect(() => {
    if (!flyer.store) return;

    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={flyer.store.name}
        imgSrc={createCloudinaryUrl(flyer.store.logo, 100, 100)}
        href={`/stores/${flyer.store.slug}`}
      />,
    );
    setSearchPlaceholder(`Search ${flyer.store.name}`);
    setSearchQueryPath(`/stores/${flyer.store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return <div className="text-center py-12">Loading flyer...</div>;
  }

  // TODO: Show products with their stock and price info similar to app/stores/[store]/[branch]/branch-page-client.tsx[202:272]. With the name of the section as the title of the product list.
  // If sections have hero images we can display those as well within the section header with a rounded border.
  return <></>;
}
