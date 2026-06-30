import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { COMMON_CATEGORIES } from "@/lib/categories";
import LocationDialogButton from "@/components/location-dialog-button";
import { useMemo } from "react";
import { useAuth } from "@/context/user-context";
import { isRoleAuthorized } from "@/lib/roles";
import { UserRole } from "graphql-utils";
import { MdOutlineFilterList } from "react-icons/md";
import { useProductSearchFilters } from "@/context/product-search-filters-context";

type ProductFilterNavToolbarProps = {
  baseUrl?: string;
};

export default function ProductFilterNavToolbar({
  baseUrl = "/search",
}: ProductFilterNavToolbarProps) {
  const { user, myStoreUsers } = useAuth();
  const {
    togglePanel,
    searchParamKeys,
    searchFilters,
    searchFiltersUrlParams,
  } = useProductSearchFilters();
  const searchParamsWithSale = useMemo(() => {
    const sale = searchFilters.sale;
    const spb = new URLSearchParams(searchFiltersUrlParams);
    if (sale) spb.delete("sale");
    else spb.set("sale", String(!sale));
    return `${baseUrl}?${spb.toString()}`;
  }, [baseUrl, searchFilters.sale, searchFiltersUrlParams]);

  return (
    <div className="flex-1 flex flex-row items-center gap-2 px-5 overflow-x-auto h-full">
      <LocationDialogButton />

      <Button
        variant="pricetra"
        size="xs"
        rounded
        onClick={() => togglePanel()}
      >
        <MdOutlineFilterList />
        Filters
        {searchParamKeys.length > 0 && (
          <span className="text-[8px] bg-white/80 h-4 px-1.5 flex items-center justify-center rounded-full text-black">
            {searchParamKeys.length}
          </span>
        )}
      </Button>

      <div className="h-full py-2 px-2">
        <Separator orientation="vertical" />
      </div>

      <div className="flex flex-row items-center gap-2">
        {user && isRoleAuthorized(UserRole.Admin, user.role) && (
          <Button href="/admin" variant="default" size="xs" rounded>
            Admin
          </Button>
        )}

        {myStoreUsers &&
          myStoreUsers.length > 0 &&
          myStoreUsers.map((s) => {
            let path = "";
            if (s.store && s.branch) {
              path = `${s.store.slug}/${s.branch.slug}`;
            } else if (s.store) {
              path = s.store.slug;
            }

            return (
              <Button
                href={`/stores/${path}/manage`}
                variant="default"
                size="xs"
                rounded
                key={`manage-${s.id}`}
              >
                Manage {s.branch?.name || s.store?.name}
              </Button>
            );
          })}

        <Button
          variant={searchFilters.sale ? "pricetra" : "outline"}
          href={searchParamsWithSale}
          size="xs"
          rounded
        >
          Sale
        </Button>

        {COMMON_CATEGORIES.map(({ id, name }) => {
          const spb = new URLSearchParams(searchFiltersUrlParams);
          if (id) spb.set("categoryId", id.toString());
          spb.set("category", name);
          return (
            <Button
              href={`${baseUrl}?${spb.toString()}`}
              variant={
                searchFilters.categoryId &&
                searchFilters.categoryId.toString() === id
                  ? "pricetra"
                  : "outline"
              }
              size="xs"
              rounded
              key={`common-category-${id}`}
            >
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
