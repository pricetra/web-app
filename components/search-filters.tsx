import { SearchRouteParams } from "@/app/search/search-page-client";
import { Button } from '@/components/ui/button';
import { toBoolean } from "@/lib/utils";

export type SearchFiltersProps = {
  params: SearchRouteParams;
};

export default function SearchFilters({ params }: SearchFiltersProps) {
  return (
    <div className="flex flex-row flex-wrap gap-2 mb-5">
      {params.query && (
        <Button variant="outline" rounded>
          Search: <b>{params.query}</b>
        </Button>
      )}
      {params.category && params.categoryId && (
        <Button variant="outline" rounded>
          Category: <b>{params.category}</b>
        </Button>
      )}
      {params.brand && (
        <Button variant="outline" rounded>
          Brand: <b>{params.brand}</b>
        </Button>
      )}
      {params.sale && toBoolean(params.sale) && (
        <Button variant="pricetra" rounded>
          Sale
        </Button>
      )}
      {params.sortByPrice && (
        <Button variant="outline" rounded>
          Sort by:
          <b>{params.sortByPrice === "asc" ? "↓ Price" : "↑ Price"}</b>
        </Button>
      )}
    </div>
  );
}