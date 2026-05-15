"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { createCloudinaryUrl } from "@/lib/files";
import { StorefrontFlyer } from "graphql-utils";
import { useLayoutEffect } from "react";

export type FlyerEditorClientProps = {
  flyer: StorefrontFlyer;
};

export default function FlyerEditorClient({ flyer }: FlyerEditorClientProps) {
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

  return <></>;
}
