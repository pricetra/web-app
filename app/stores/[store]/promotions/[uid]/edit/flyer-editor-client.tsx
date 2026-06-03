"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { createCloudinaryUrl } from "@/lib/files";
import {
  PublishDraftStorefrontFlyerDocument,
  StorefrontFlyer,
  StorefrontFlyerStatus,
} from "graphql-utils";
import { useEffect, useLayoutEffect } from "react";
import FlyerEditorProvider from "@/context/flyer-editor-context";
import FlyerEditor from "./components/flyer-editor";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from "next/navigation";

export type FlyerEditorClientProps = {
  flyer: StorefrontFlyer;
};

export default function FlyerEditorClient({ flyer }: FlyerEditorClientProps) {
  const router = useRouter();
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
    setNavTools,
  } = useNavbar();
  const [publishDraftFlyer, { data: publishData, loading: publishing }] =
    useMutation(PublishDraftStorefrontFlyerDocument);

  useLayoutEffect(() => {
    if (!flyer.store) return;

    const storeHref = `/stores/${flyer.store.slug}${flyer.branch ? `/${flyer.branch.slug}` : ""}`;
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title="Flyer Editor"
        subTitle={flyer.branch?.name ?? flyer.store.name}
        imgSrc={createCloudinaryUrl(flyer.store.logo, 100, 100)}
        href={storeHref}
        titleHref=""
        subTitleHref={storeHref}
      />,
    );
    setSearchPlaceholder(`Search ${flyer.store.name}`);
    setSearchQueryPath(`/stores/${flyer.store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyer]);

  useEffect(() => {
    if (publishData?.publishDraftStorefrontFlyer) return;

    router.push(`/stores/${flyer.store?.slug}/promotions/${flyer.uid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishData]);

  useEffect(() => {
    if (flyer.status !== StorefrontFlyerStatus.Draft) return;

    setNavTools(
      <Button
        onClick={() => {
          publishDraftFlyer({ variables: { id: flyer.id } });
        }}
        variant="pricetra"
        size="xs"
        disabled={publishing}
      >
        {publishing && <CgSpinner className="animate-spin" />}
        Publish Flyer
      </Button>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyer, publishDraftFlyer, publishing]);

  if (flyer.status !== StorefrontFlyerStatus.Draft) {
    return (
      <div className="flex flex-row items-center justify-center h-[50vh] gap-2 text-gray-600 w-full">
        <p>Flyer is not in draft status and cannot be edited.</p>
      </div>
    );
  }

  return (
    <FlyerEditorProvider flyer={flyer}>
      <FlyerEditor />
    </FlyerEditorProvider>
  );
}
