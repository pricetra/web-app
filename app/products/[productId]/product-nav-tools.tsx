import AddPriceForm from "@/components/product-form/add-price-form";
import ProductForm from "@/components/product-form/product-form";
import ProductItem from "@/components/product-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NavToolIconButton from "@/components/ui/nav-tool-icon-button";
import { useAuth } from "@/context/user-context";
import { isRoleAuthorized } from "@/lib/roles";
import { useMutation } from "@apollo/client/react";
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
  UserRole,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AiFillEye,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
} from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import {
  FaFacebook,
  FaHandSparkles,
  FaLink,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { FiEdit, FiPlus, FiShare } from "react-icons/fi";
import { toast } from "sonner";

export type ProductNavToolsProps = {
  product: Product;
  stockId?: number;
  stock?: Stock;
};

export default function ProductNavTools({
  product,
  stockId,
  stock,
}: ProductNavToolsProps) {
  const { user, lists } = useAuth();
  const router = useRouter();
  const [sanitizeProduct, { loading: sanitizing }] = useMutation(
    SanitizeProductDocument,
    {
      variables: { id: product.id },
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
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const fullUrl = useMemo(() => {
    const paramBuilder = new URLSearchParams();
    if (stockId) {
      paramBuilder.set("stockId", stockId.toString());
    }
    if (user) {
      paramBuilder.set("sharedBy", user.id.toString());
    }
    paramBuilder.set("sharedFrom", "web");
    return `https://pricetra.com/products/${
      product.id
    }?${paramBuilder.toString()}`;
  }, [product.id, stockId, user]);

  useEffect(() => {
    const fav = product.productList.find((p) => p.type === ListType.Favorites);
    setFavProductList(fav);
    setFav(!!fav);
    const watch = product.productList.find(
      (p) => p.type === ListType.WatchList && p.stockId === stockId
    );
    setWatchProductList(watch);
    setWatch(!!watch);
  }, [product, stockId]);

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
        productId: +product.id,
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

  return (
    <>
      {stock && (
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
            <CgSpinner className="animate-spin text-sanitize" />
          ) : (
            <FaHandSparkles className="text-sanitize" />
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

          <DialogContent size="xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <div className="mt-5">
                <ProductForm
                  upc={product?.code}
                  product={product}
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
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {user && (
        <Dialog
          modal
          open={priceModalOpen}
          defaultOpen={priceModalOpen}
          onOpenChange={(o) => setPriceModalOpen(o)}
        >
          <Button
            onClick={() => setPriceModalOpen(true)}
            className="rounded-full bg-green-100 px-3 pl-2 text-pricetra-green-heavy-dark hover:bg-green-200 font-bold shadow-none"
            size="xs"
          >
            <FiPlus />
            Price
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Price</DialogTitle>
              <div className="mt-5">
                <AddPriceForm
                  product={product}
                  onCancel={() => setPriceModalOpen(false)}
                  onSuccess={(p) => {
                    router.push(`?stockId=${p.stockId}`);
                    toast.success("Product price submitted");
                    setPriceModalOpen(false);
                  }}
                  onError={(e) => {
                    toast.error(`Could not add price: ${e.message}`);
                  }}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        modal
        open={shareModalOpen}
        defaultOpen={shareModalOpen}
        onOpenChange={(o) => setShareModalOpen(o)}
      >
        <NavToolIconButton
          onClick={() => setShareModalOpen(true)}
          tooltip="Share"
        >
          <FiShare className="text-share" />
        </NavToolIconButton>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <div className="my-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-5">
                <ProductItem product={{ ...product, stock }} />
              </div>

              <div className="flex flex-row flex-wrap items-center justify-evenly gap-5">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    fullUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col gap-2 p-1 justify-center items-center"
                >
                  <div className="p-3 rounded-full bg-facebook">
                    <FaFacebook color="white" size={20} />
                  </div>
                  <span className="text-xs">Facebook</span>
                </a>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(fullUrl)}`}
                  target="_blank"
                  className="flex flex-col gap-2 p-1 justify-center items-center"
                >
                  <div className="p-3 rounded-full bg-whatsapp">
                    <FaWhatsapp color="white" size={20} />
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </a>

                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                    fullUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col gap-2 p-1 justify-center items-center"
                >
                  <div className="p-3 rounded-full bg-twitter">
                    <FaXTwitter color="white" size={20} />
                  </div>
                  <span className="text-xs">X</span>
                </a>

                <a
                  href={`https://nextdoor.com/news_feed/?open_composer=true&body=${encodeURIComponent(
                    fullUrl
                  )}`}
                  target="_blank"
                  className="flex flex-col gap-2 p-1 justify-center items-center"
                >
                  <div className="p-3 rounded-full bg-nextdoor">
                    <svg
                      fill="#ffffff"
                      width="20px"
                      height="20px"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path d="M31.99 13.089l-15.99-9.792-5.495 3.365v-3.365h-5.005v6.427l-5.495 3.365 2.615 4.271 2.88-1.755v13.099h21v-13.099l2.875 1.755 2.615-4.271z"></path>{" "}
                      </g>
                    </svg>
                  </div>
                  <span className="text-xs">Nextdoor</span>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fullUrl);
                    toast.success("Copied URL to clipboard!");
                  }}
                  className="flex flex-col gap-2 p-1 justify-center items-center cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-white border border-gray-300">
                    <FaLink color="black" size={20} />
                  </div>
                  <span className="text-xs">Copy Link</span>
                </button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
