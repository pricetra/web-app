import LoginSignupButtons from "@/components/login-signup-buttons";
import StockItemMini, {
  StockItemMiniLoading,
} from "@/components/stock-item-mini";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/context/user-context";
import { useQuery } from "@apollo/client/react";
import {
  BranchListWithPrices,
  FavoriteBranchesWithPricesDocument,
  Product,
  Stock,
} from "graphql-utils";
import { useMemo } from "react";

export type StockWithApproximatePrice = Stock & {
  approximatePrice?: number;
};

function stockToApproxMap(
  data: BranchListWithPrices,
): StockWithApproximatePrice {
  return {
    id: data.stock?.id ?? 0,
    productId: data.stock?.productId,
    latestPriceId: data.stock?.latestPrice?.id ?? 0,
    latestPrice: { ...data.stock?.latestPrice },
    branchId: data.branchId,
    branch: data.branch,
    store: data.branch?.store,
    storeId: data.branch?.storeId,
    approximatePrice: data.approximatePrice,
  } as StockWithApproximatePrice;
}

export default function ProductDetailsFavoriteStoresTab({
  product,
}: {
  product: Product;
}) {
  const { loggedIn, lists } = useAuth();
  const { data: favBranchesPriceData } = useQuery(
    FavoriteBranchesWithPricesDocument,
    {
      variables: { productId: product.id },
      fetchPolicy: "no-cache",
    },
  );
  const availableFavoriteBranches = useMemo(
    () =>
      favBranchesPriceData?.getFavoriteBranchesWithPrices?.filter(
        (d) => d.approximatePrice || d.stock?.latestPriceId,
      ) as BranchListWithPrices[] | undefined,
    [favBranchesPriceData],
  );
  const mappedFavBranches = useMemo(
    () =>
      (
        (favBranchesPriceData?.getFavoriteBranchesWithPrices ??
          []) as BranchListWithPrices[]
      ).map(stockToApproxMap),
    [favBranchesPriceData],
  );

  return (
    <AccordionItem value="favorite-stores">
      <AccordionTrigger badge={availableFavoriteBranches?.length}>
        Favorite Stores
      </AccordionTrigger>
      <AccordionContent>
        {loggedIn ? (
          <>
            {favBranchesPriceData ? (
              <section className="grid grid-cols-2 gap-5 mt-5">
                {mappedFavBranches.map(({ approximatePrice, ...s }, i) => (
                  <div
                    className="mb-3 flex flex-row"
                    key={`${s.id}-${i}-fav-store-stock`}
                  >
                    <StockItemMini
                      productId={product.id}
                      product={product}
                      stock={s as Stock}
                      approximatePrice={approximatePrice ?? undefined}
                      disabled={s.id === 0 && !approximatePrice}
                    />
                  </div>
                ))}
              </section>
            ) : (
              <section className="grid grid-cols-2 gap-5 mt-5">
                {Array(lists?.favorites.branchList?.length ?? 5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      className="mb-3"
                      key={`favorite-branch-stock-loading-${i}`}
                    >
                      <StockItemMiniLoading />
                    </div>
                  ))}
              </section>
            )}
          </>
        ) : (
          <div className="my-10">
            <h3 className="text-center text-lg font-bold mb-5">
              View prices from your Favorite Stores
            </h3>

            <LoginSignupButtons />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
