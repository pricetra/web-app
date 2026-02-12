import { ProductItemLoading } from "@/components/product-item";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuery } from "@apollo/client/react";
import { MySearchHistoryDocument } from "graphql-utils";
import { useMediaQuery } from "react-responsive";
import { HiInboxStack } from "react-icons/hi2";
import { useState } from "react";
import { SmartPagination } from "@/components/ui/smart-pagination";
import SearchResultItem from "@/components/search-result-item";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type SearchHistoryListViewProps = {};

export default function SearchHistoryListView({}: SearchHistoryListViewProps) {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(MySearchHistoryDocument, {
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

  if (data && data.mySearchHistory.paginator.total === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HiInboxStack />
          </EmptyMedia>
          <EmptyTitle>
            Your Search History List is Empty. Search keywords will be added when you
            search something.
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
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
            {data.mySearchHistory.searches.map((s, i) => {
              return (
                <SearchResultItem
                  key={`search-${s.id}-${i}`}
                  searchTerm={s.searchTerm}
                  handleOnClick={() => {}}
                />
              );
            })}
          </>
        )}
      </div>

      {data && data.mySearchHistory.paginator.numPages > 1 && (
        <div className="mt-16">
          <SmartPagination
            paginator={data.mySearchHistory.paginator}
            disableHref
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
