import ProductItem, { ProductItemLoading } from "@/components/product-item";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuery } from "@apollo/client/react";
import {
  GetAllProductListsByListIdDocument,
  List,
  Product,
  Stock,
} from "graphql-utils";
import { useMediaQuery } from "react-responsive";
import { HiInboxStack } from "react-icons/hi2";

export type ProductListViewProps = {
  list: List;
};

export default function ProductListView({ list }: ProductListViewProps) {
  const { data, loading } = useQuery(GetAllProductListsByListIdDocument, {
    fetchPolicy: "no-cache",
    variables: {
      listId: list.id,
    },
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  if (data && data.getAllProductListsByListId.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HiInboxStack />
          </EmptyMedia>
          <EmptyTitle>Your Product List is Empty</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-3">
        {!data || loading ? (
          Array(10)
            .fill(0)
            .map((_, j) => (
              <ProductItemLoading
                key={`product-loading-${j}`}
                imgWidth={isMobile ? 110 : 130}
              />
            ))
        ) : (
          <>
            {data.getAllProductListsByListId.map((pList, i) => {
              if (!pList.product) return <></>;

              const product = { ...(pList.product as Product) };
              if (pList.stockId !== null && pList.stock) {
                product.stock = { ...(pList.stock as Stock) };
              }
              return (
                <ProductItem
                  product={product}
                  branchSlug={pList.stock?.branch?.slug}
                  imgWidth={isMobile ? 110 : 130}
                  key={`product-${pList.id}-${pList.productId}-${i}`}
                  hideStoreInfo={false}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
