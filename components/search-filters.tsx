import { Button } from "@/components/ui/button";
import { useProductSearchFilters } from "@/context/product-search-filters-context";

export default function SearchFilters() {
  const { searchFilters } = useProductSearchFilters();

  return (
    <>
      {searchFilters.query && (
        <Button variant="outline" rounded>
          Search: <b>{searchFilters.query}</b>
        </Button>
      )}
      {searchFilters.category && searchFilters.categoryId && (
        <Button variant="outline" rounded>
          Category: <b>{searchFilters.category}</b>
        </Button>
      )}
      {searchFilters.brand && (
        <Button variant="outline" rounded>
          Brand: <b>{searchFilters.brand}</b>
        </Button>
      )}
      {searchFilters.sale && (
        <Button variant="pricetra" rounded>
          Sale
        </Button>
      )}
      {searchFilters.sortByPrice && (
        <Button variant="outline" rounded>
          Sort by:
          <b>{searchFilters.sortByPrice === "asc" ? "↓ Price" : "↑ Price"}</b>
        </Button>
      )}
    </>
  );
}
