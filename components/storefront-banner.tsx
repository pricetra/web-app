"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GetStorefrontBannerDocument,
  DeleteStorefrontBannerItemDocument,
  DeleteAllStorefrontBannerItemsDocument,
  Store,
  Branch,
  UserRole,
  StorefrontBannerItem as StorefrontBannerItemType,
} from "graphql-utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateStorefrontBannerForm from "@/components/create-storefront-banner-form";
import EditStorefrontBannerItemForm from "@/components/edit-storefront-banner-item-form";
import { useAuth } from "@/context/user-context";
import useStoreUser from "@/hooks/useStoreUser";
import { isRoleAuthorized } from "@/lib/roles";
import { toast } from "sonner";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
import { isMobile } from "react-device-detect";

type BannerDialog =
  | { type: "create" }
  | { type: "append" }
  | { type: "edit"; item: StorefrontBannerItemType }
  | null;

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
      : storeUserBranches.some((b) => b.storeId === store.id);
  }, [user, storeUserBranches, branch, store.id]);

  const [dialog, setDialog] = useState<BannerDialog>(null);

  const refetchQueries = [
    {
      query: GetStorefrontBannerDocument,
      variables: { storeId: store.id, branchId: branch?.id },
    },
  ];

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

  const bannerId = bannerData?.getStorefrontBanner?.id;

  const [deleteBannerItem] = useMutation(DeleteStorefrontBannerItemDocument, {
    refetchQueries,
  });

  const [deleteAllBannerItems] = useMutation(
    DeleteAllStorefrontBannerItemsDocument,
    { refetchQueries },
  );

  const handleDeleteItem = (item: StorefrontBannerItemType) => {
    if (!confirm(`Delete banner slide "${item.title || `#${item.id}`}"?`))
      return;

    deleteBannerItem({
      variables: { bannerItemId: item.id },
    }).then(({ data }) => {
      if (data) toast.success("Banner slide deleted");
    });
  };

  const handleDeleteAll = () => {
    if (!bannerId) return;
    if (!confirm("Delete all banner slides? This cannot be undone.")) return;

    deleteAllBannerItems({
      variables: { storefrontBannerId: bannerId },
    }).then(({ data }) => {
      if (data) toast.success("All banner slides deleted");
    });
  };

  return (
    <>
      <Dialog
        modal
        open={dialog !== null}
        onOpenChange={(o) => !o && setDialog(null)}
      >
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type === "edit"
                ? "Edit Banner Slide"
                : dialog?.type === "append"
                  ? "Add Banner Slides"
                  : "Create Storefront Banner"}
            </DialogTitle>
          </DialogHeader>
          {dialog?.type === "edit" ? (
            <EditStorefrontBannerItemForm
              item={dialog.item}
              storeId={store.id}
              branchId={branch?.id}
              onSuccess={() => setDialog(null)}
            />
          ) : (
            <CreateStorefrontBannerForm
              storeId={store.id}
              branchId={branch?.id}
              onSuccess={() => setDialog(null)}
              append={dialog?.type === "append"}
            />
          )}
        </DialogContent>
      </Dialog>

      {bannerItems.length > 0 ? (
        <div className="sm:px-5 -mt-5 sm:mt-5 mb-5 sm:mb-10">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {bannerItems.map((item) => (
                <StorefrontBannerItem
                  key={item.id}
                  item={item}
                  isStoreUser={isStoreUser}
                  onEdit={() => setDialog({ type: "edit", item })}
                  onDelete={() => handleDeleteItem(item)}
                />
              ))}
            </CarouselContent>
            {bannerItems.length > 1 && !isMobile && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
          {isStoreUser && (
            <div className="flex justify-end mt-2 gap-2 px-4 sm:px-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IoIosSettings className="size-4 mr-1" />
                    Manage Banners
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setDialog({ type: "append" })}
                  >
                    <FiPlus className="size-4 mr-1" />
                    Add slides
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteAll}
                    className="text-red-600 focus:text-red-600"
                  >
                    <FiTrash2 className="size-4 mr-1" />
                    Delete all slides
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ) : (
        isStoreUser && (
          <div className="px-5">
            <div className="border border-gray-100 bg-gray-50 rounded-lg px-5 py-2 flex flex-row gap-5 items-center justify-between mb-10">
              <span className="flex-2 font-semibold">
                Add storefront banner
              </span>
              <Button
                onClick={() => setDialog({ type: "create" })}
                variant="pricetra"
                size="sm"
              >
                Add Banner
              </Button>
            </div>
          </div>
        )
      )}
    </>
  );
}
