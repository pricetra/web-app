"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GetStorefrontBannerDocument, Store, Branch, UserRole } from "graphql-utils";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import StorefrontBannerItem from "@/components/storefront-banner-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateStorefrontBannerForm from "@/components/create-storefront-banner-form";
import { useAuth } from "@/context/user-context";
import useStoreUser from "@/hooks/useStoreUser";
import { isRoleAuthorized } from "@/lib/roles";
import { useMediaQuery } from "react-responsive";

export default function StorefrontBanner({
  store,
  branch,
}: {
  store: Store;
  branch?: Branch;
}) {
  const { user } = useAuth();
  const storeUserBranches = useStoreUser();
  const isStoreUser = useMemo(() => {
    if (!user) return false;

    const isAdminUser = isRoleAuthorized(UserRole.Admin, user.role);
    if (isAdminUser) return true;

    if (!storeUserBranches) return false;
    return branch
      ? storeUserBranches.some((b) => b.id === branch.id)
      : storeUserBranches.some((b) => b.storeId === store.id); // Admin user with access to store level permissions
  }, [user, storeUserBranches, branch, store.id]);

  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  const [showAddBannerDialog, setShowAddBannerDialog] = useState(false);

  const { data: bannerData } = useQuery(GetStorefrontBannerDocument, {
    variables: {
      storeId: store.id,
      branchId: branch?.id,
    },
  });

  const bannerItems = useMemo(
    () =>
      bannerData?.getStorefrontBanner?.bannerItems
        ?.slice()
        .sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
    [bannerData],
  );

  return (
    <>
      <Dialog
        modal
        open={showAddBannerDialog}
        defaultOpen={showAddBannerDialog}
        onOpenChange={(o) => setShowAddBannerDialog(o)}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Add Storefront Banner</DialogTitle>
          </DialogHeader>
          <CreateStorefrontBannerForm
            storeId={store.id}
            branchId={branch?.id}
            onSuccess={() => setShowAddBannerDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {bannerItems.length > 0 ? (
        <div className="px-5 sm:mt-5 mb-5 sm:mb-10">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {bannerItems.map((item) => (
                <StorefrontBannerItem key={item.id} item={item} />
              ))}
            </CarouselContent>
            {bannerItems.length > 1 && !isMobile && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      ) : (
        isStoreUser && (
          <div className="border border-gray-100 bg-gray-50 rounded-lg px-5 py-2 flex flex-row gap-5 items-center justify-between mb-10">
            <span className="flex-2 font-semibold">Add storefront banner</span>
            <Button
              onClick={() => setShowAddBannerDialog(true)}
              variant="pricetra"
              size="sm"
            >
              Add Banner
            </Button>
          </div>
        )
      )}
    </>
  );
}
