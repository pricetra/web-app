"use client";

import { useNavbar } from "@/context/navbar-context";
import { Store } from "graphql-utils";
import { createCloudinaryUrl } from "@/lib/files";
import { useLayoutEffect, useState } from "react";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import StorefrontBanner from "@/components/storefront-banner";
import ManageStoreInfo from "@/components/manage/manage-store-info";
import ManageBranchList from "@/components/manage/manage-branch-list";
import CreateBranchForm from "@/components/manage/create-branch-form";
import { startOfNextSundayUTC } from "@/lib/utils";

export default function ManageStorePageClient({ store }: { store: Store }) {
  const {
    setPageIndicator,
    resetAll,
    setSearchPlaceholder,
    setSearchQueryPath,
  } = useNavbar();
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);

  useLayoutEffect(() => {
    resetAll();
    setPageIndicator(
      <NavPageIndicator
        title={store.name}
        subTitle="Store Management"
        imgSrc={createCloudinaryUrl(
          store.logo,
          100,
          100,
          startOfNextSundayUTC(),
        )}
        href={`/stores/${store.slug}`}
        titleHref={`/stores/${store.slug}/manage`}
        subTitleHref={`/stores/${store.slug}/manage`}
      />,
    );
    setSearchPlaceholder(`Search ${store.name}`);
    setSearchQueryPath(`/stores/${store.slug}`);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] flex-1 px-5">
        {/* Store Header */}
        <div className="flex flex-row items-center gap-10 mb-8">
          <div className="flex flex-row gap-4">
            <Image
              src={createCloudinaryUrl(store.logo, 300, 300)}
              className="size-16 rounded-xl"
              alt={store.name}
              width={300}
              height={300}
            />
            <div className="flex-1">
              <h1 className="text-lg font-bold">{store.name}</h1>
              {store.website && (
                <p className="text-xs text-gray-500">{store.website}</p>
              )}
              <Button
                variant="outline"
                size="xs"
                className="mt-2"
                onClick={() => setShowStoreDetails(!showStoreDetails)}
              >
                {showStoreDetails ? "Cancel Editing" : "Edit Store"}
              </Button>
            </div>
          </div>
        </div>

        {showStoreDetails && (
          <section className="mb-10 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Store Details</h2>
            <ManageStoreInfo store={store} />
          </section>
        )}

        {/* Banner */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 px-0">Storefront Banner</h2>
          <StorefrontBanner store={store} />
        </section>

        {/* Branches */}
        <section className="mb-10">
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Branches</h2>
            <Button
              variant="pricetra"
              size="xs"
              onClick={() => setShowCreateBranch(!showCreateBranch)}
            >
              <MdAdd /> New Branch
            </Button>
          </div>

          {showCreateBranch && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-4">Create New Branch</h3>
              <CreateBranchForm
                store={store}
                onCreated={() => setShowCreateBranch(false)}
                onCancel={() => setShowCreateBranch(false)}
              />
            </div>
          )}

          <ManageBranchList
            store={store}
            branchHref={(branchSlug) =>
              `/stores/${store.slug}/${branchSlug}/manage`
            }
          />
        </section>
      </div>
    </>
  );
}
