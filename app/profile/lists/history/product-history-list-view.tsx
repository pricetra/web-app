import ProductItem, { ProductItemLoading } from "@/components/product-item";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuery } from "@apollo/client/react";
import { MyProductViewHistoryDocument, Product } from "graphql-utils";
import { useMediaQuery } from "react-responsive";
import { HiInboxStack } from "react-icons/hi2";
import { useState } from "react";
import { SmartPagination } from "@/components/ui/smart-pagination";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ProductHistoryListViewProps = {};

export default function ProductHistoryListView({}: ProductHistoryListViewProps) {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(MyProductViewHistoryDocument, {
    fetchPolicy: "no-cache",
    variables: {
      paginator: {
        limit: 30,
        page,
      },
    },
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  if (data && data.myProductViewHistory.paginator.total === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HiInboxStack />
          </EmptyMedia>
          <EmptyTitle>
            Your Product History List is Empty. Products will be added when you
            view something.
          </EmptyTitle>
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
            {data.myProductViewHistory.products.map((p, i) => {
              return (
                <ProductItem
                  product={p as Product}
                  branchSlug={p.stock?.branch?.slug}
                  imgWidth={isMobile ? 110 : 130}
                  key={`product-${p.id}-${p.stock?.id ?? 0}-${i}`}
                  hideStoreInfo={false}
                />
              );
            })}
          </>
        )}
      </div>

      {data && data.myProductViewHistory.paginator.numPages > 1 && (
        <div className="mt-16">
          <SmartPagination
            paginator={data.myProductViewHistory.paginator}
            disableHref
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
