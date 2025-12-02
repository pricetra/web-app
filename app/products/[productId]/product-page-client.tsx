"use client";

import ProductFull, { ProductFullLoading } from "@/components/product-full";
import {
  AddToListDocument,
  GetAllListsDocument,
  GetAllProductListsByListIdDocument,
  ListType,
  Product,
  ProductDocument,
  ProductList,
  RemoveFromListDocument,
  SanitizeProductDocument,
  Stock,
  StockDocument,
  UserRole,
} from "graphql-utils";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import SelectedStock, {
  SelectedStockLoading,
} from "@/components/selected-stock";

import { useAuth } from "@/context/user-context";
import useLocationInput from "@/hooks/useLocationInput";
import { Button } from "@/components/ui/button";
import { NAVBAR_HEIGHT } from "@/components/ui/navbar-main";
import { useNavbar } from "@/context/navbar-context";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { createCloudinaryUrl } from "@/lib/files";
import { FiEdit, FiPlus } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { FaHandSparkles } from "react-icons/fa";
import { isRoleAuthorized } from "@/lib/roles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/components/product-form/product-form";
import { toast } from "sonner";
import { useMediaQuery } from "react-responsive";
import NavToolIconButton from "@/components/ui/nav-tool-icon-button";
import { FiShare } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import ProductDetails from "./product-details";
import { AiFillEye } from "react-icons/ai";

export type ProductPageClientProps = {
  productId: number;
  stockId?: number;
  sharedBy?: number;
  sharedFrom?: string;
  ipAddress: string;
};

export default function ProductPageClient({
  productId,
  stockId,
  ipAddress,
}: ProductPageClientProps) {
  const { loggedIn, user, lists } = useAuth();
  const { setPageIndicator, resetAll, setNavTools, setSubHeader } = useNavbar();
  const locationInput = useLocationInput(!loggedIn ? ipAddress : undefined);
  const { data: productData, loading: productLoading } = useQuery(
    ProductDocument,
    {
      fetchPolicy: "network-only",
      variables: { productId, viewerTrail: { stockId } },
    }
  );
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(
    StockDocument,
    { fetchPolicy: "no-cache" }
  );
  const [sanitizeProduct, { loading: sanitizing }] = useMutation(
    SanitizeProductDocument,
    {
      variables: { id: productId },
      refetchQueries: [ProductDocument],
    }
  );
  const [addToList] = useMutation(AddToListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllProductListsByListIdDocument],
  });
  const [removeFromList] = useMutation(RemoveFromListDocument, {
    refetchQueries: [GetAllListsDocument, GetAllProductListsByListIdDocument],
  });
  const [favProductList, setFavProductList] = useState<ProductList>();
  const [fav, setFav] = useState(false);
  const [watchProductList, setWatchProductList] = useState<ProductList>();
  const [watch, setWatch] = useState(false);
  const [editProductModalOpen, setEditProductOpenModal] = useState(false);
  const isMediumScreen = useMediaQuery({ query: "(max-width: 800px)" });

  async function add(
    type: ListType.WatchList | ListType.Favorites,
    cb: (p?: ProductList) => void
  ) {
    if (!lists) return;

    // Check notification permissions
    if (type === ListType.WatchList) {
      // TODO: Handle notifications
    }

    const listId =
      type === ListType.Favorites ? lists.favorites.id : lists.watchList.id;
    const { data } = await addToList({
      variables: {
        listId,
        productId: +productId,
        stockId: type === ListType.WatchList && stockId ? +stockId : undefined,
      },
    });
    cb(data?.addToList);
  }

  async function remove(
    type: ListType.WatchList | ListType.Favorites,
    cb: (p?: ProductList) => void
  ) {
    if (!lists) return;

    const listId =
      type === ListType.Favorites ? lists.favorites.id : lists.watchList?.id;
    const productListId =
      type === ListType.Favorites ? favProductList?.id : watchProductList?.id;
    if (!productListId) return;

    const { data } = await removeFromList({
      variables: {
        listId,
        productListId,
      },
    });
    cb(data?.removeFromList);
  }

  const NavTools = useMemo(
    () => (
      <>
        {stockData && (
          <NavToolIconButton
            onClick={() => {
              if (watchProductList) {
                setWatch(false);
                return remove(ListType.WatchList, (pl) => {
                  setWatchProductList(undefined);
                  if (!pl) setWatch(true);
                });
              }
              setWatch(true);
              add(ListType.WatchList, (pl) => {
                setWatchProductList(pl);
                if (!pl) setWatch(false);
              });
            }}
            tooltip="Add to watchlist"
          >
            {watch ? (
              <AiFillEye className="text-watch text-lg" />
            ) : (
              <AiOutlineEye className="text-watch text-lg" />
            )}
          </NavToolIconButton>
        )}

        <NavToolIconButton
          onClick={() => {
            if (favProductList) {
              setFav(false);
              return remove(ListType.Favorites, (pl) => {
                setFavProductList(undefined);
                if (!pl) setFav(true);
              });
            }
            setFav(true);
            add(ListType.Favorites, (pl) => {
              setFavProductList(pl);
              if (!pl) setFav(false);
            });
          }}
          tooltip="Add to favorites"
        >
          {fav ? (
            <AiFillHeart className="text-like" />
          ) : (
            <AiOutlineHeart className="text-like" />
          )}
        </NavToolIconButton>

        {isRoleAuthorized(
          UserRole.Contributor,
          user?.role ?? UserRole.Consumer
        ) && (
          <NavToolIconButton
            onClick={() => sanitizeProduct()}
            tooltip="Sanitize product data with AI"
          >
            {sanitizing ? (
              <>
                <CgSpinner className="animate-spin text-sanitize" />
              </>
            ) : (
              <>
                <FaHandSparkles className="text-sanitize" />
              </>
            )}
          </NavToolIconButton>
        )}

        {isRoleAuthorized(
          UserRole.Contributor,
          user?.role ?? UserRole.Consumer
        ) && (
          <Dialog
            modal
            open={editProductModalOpen}
            defaultOpen={editProductModalOpen}
            onOpenChange={(o) => setEditProductOpenModal(o)}
          >
            <NavToolIconButton
              onClick={() => setEditProductOpenModal(true)}
              tooltip="Edit product"
            >
              <FiEdit className="text-edit" />
            </NavToolIconButton>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription className="mt-5">
                  <ProductForm
                    upc={productData?.product?.code}
                    product={productData?.product}
                    onSuccess={() => {
                      toast.success("Product updated successfully");
                      setEditProductOpenModal(false);
                    }}
                    onError={(err) => {
                      toast.error(err.message);
                      setEditProductOpenModal(false);
                    }}
                    onCancel={() => setEditProductOpenModal(false)}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        <Button
          onClick={() => {}}
          className="rounded-full bg-green-100 px-3 pl-2 text-pricetra-green-heavy-dark hover:bg-green-200 font-bold shadow-none"
          size="xs"
        >
          <FiPlus />
          Price
        </Button>

        <NavToolIconButton onClick={() => {}} tooltip="Share">
          <FiShare className="text-share" />
        </NavToolIconButton>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      productData,
      user,
      stockData,
      sanitizing,
      editProductModalOpen,
      favProductList,
      watchProductList,
      fav,
      watch,
    ]
  );

  useEffect(() => {
    if (!productData) return;

    const fav = productData.product.productList.find(
      (p) => p.type === ListType.Favorites
    );
    setFavProductList(fav);
    const watch = productData.product.productList.find(
      (p) => p.type === ListType.WatchList && p.stockId === stockId
    );
    setWatchProductList(watch);
  }, [productData, stockId]);

  // Get stock from stockId
  useEffect(() => {
    if (!stockId || !productData) return;
    getStock({
      variables: {
        stockId,
      },
    });
  }, [stockId, productData, getStock]);

  useLayoutEffect(() => {
    if (!stockData || !stockData?.stock.store) return;

    setPageIndicator(
      <NavPageIndicator
        title={stockData.stock.store.name}
        imgSrc={createCloudinaryUrl(stockData.stock.store.logo, 100, 100)}
        href={`/stores/${stockData.stock.store.slug}`}
      />
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData]);

  useLayoutEffect(() => {
    if (!user || !productData) return;
    if (isMediumScreen) {
      setSubHeader(NavTools);
      setNavTools(undefined);
      return;
    }

    setSubHeader(undefined);
    setNavTools(NavTools);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productData,
    user,
    stockData,
    sanitizing,
    editProductModalOpen,
    NavTools,
    isMediumScreen,
  ]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      <section className="w-full flex-1 relative">
        <div
          className="lg:sticky flex flex-col gap-5 left-0 p-5 bg-white"
          style={{ top: NAVBAR_HEIGHT + 20 }}
        >
          <article>
            {productData && !productLoading ? (
              <ProductFull
                product={productData.product as Product}
                hideDescription
              />
            ) : (
              <ProductFullLoading />
            )}
          </article>

          {stockId &&
            (stockData &&
            !stockLoading &&
            productData &&
            stockData.stock.productId === productData.product.id ? (
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStock
                    stock={stockData.stock as Stock}
                    quantityType={productData.product.quantityType}
                    quantityValue={productData.product.quantityValue}
                  />
                </div>
              </div>
            ) : (
              <div className="my-5">
                <div className="rounded-xl bg-gray-50 p-5">
                  <SelectedStockLoading />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="w-full flex-2 max-w-full lg:max-w-xl xl:max-w-3xl">
        {productData && locationInput && (
          <ProductDetails
            product={productData.product}
            locationInput={locationInput}
            stock={stockData?.stock as Stock | undefined}
          />
        )}
      </section>
    </div>
  );
}
