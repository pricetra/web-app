import AddPriceForm from "@/components/product-form/add-price-form";
import ProductForm from "@/components/product-form/product-form";
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
import { useEffect, useState } from "react";
import {
  AiFillEye,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
} from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { FaHandSparkles } from "react-icons/fa";
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

          {product && (
            <DialogContent>
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
          )}
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
                  onCancel={() => {}}
                  onSuccess={() => {}}
                  onError={() => {}}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <NavToolIconButton onClick={() => {}} tooltip="Share">
        <FiShare className="text-share" />
      </NavToolIconButton>
    </>
  );
}
