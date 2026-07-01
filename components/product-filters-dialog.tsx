import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  AllBrandsDocument,
  BranchType,
  Category,
  CategorySearchDocument,
  GetCategoryDocument,
} from "graphql-utils";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-dropdown-select";
import { useProductSearchFilters } from "@/context/product-search-filters-context";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { useCurrentLocation } from "@/context/location-context";

export type ProductFiltersDialogProps = {
  searchBaseUrl: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ProductFiltersDialog({
  searchBaseUrl,
  open,
  onOpenChange,
}: ProductFiltersDialogProps) {
  const router = useRouter();
  const { searchFilters } = useProductSearchFilters();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const searchParams = useSearchParams();
  const urlParamsBuilder = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );
  const { data: brandsData, loading: brandsLoading } = useQuery(
    AllBrandsDocument,
    { variables: { joinStock: true, filters: searchFilters } },
  );
  const brand = searchParams.get("brand");
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    CategorySearchDocument,
    { variables: { search: "", filters: searchFilters } },
  );
  const [getCategory] = useLazyQuery(GetCategoryDocument);
  const [category, setCategory] = useState<Category>();
  const categoryId = searchFilters.categoryId;

  useEffect(() => {
    if (!categoryId) return;

    getCategory({ variables: { id: +categoryId } }).then(({ data }) => {
      if (!data) return;

      setCategory(data.getCategory);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription className="text-gray-600 text-xs">
            Update the search filters to refine your search results.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 my-5">
          <div className="flex flex-row justify-between items-center gap-3"></div>
          <div className="flex items-center space-x-2">
            <Switch
              id="sale"
              checked={searchFilters.sale ?? false}
              onCheckedChange={() => {
                const spb = new URLSearchParams(urlParamsBuilder);
                if (searchFilters.sale === true) {
                  spb.delete("sale");
                } else {
                  spb.set("sale", String(true));
                }
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
            />
            <Label htmlFor="sale">Sale</Label>
          </div>

          <div>
            <Label>Brands</Label>

            <Select
              options={brandsData?.allBrands ?? []}
              values={brand ? [{ brand, products: 0 }] : []}
              labelField="brand"
              valueField="brand"
              onChange={(v) => {
                if (v.length === 0) return;

                const categorySelect = v.at(0);
                if (!categorySelect) return;

                const spb = new URLSearchParams(urlParamsBuilder);
                spb.set("brand", categorySelect.brand);
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
              onClearAll={() => {
                const spb = new URLSearchParams(urlParamsBuilder);
                spb.delete("brand");
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
              loading={brandsLoading}
              clearable
              searchable
              placeholder="Select brand"
              multi={false}
            />
          </div>

          <div>
            <Label>Categories</Label>

            <Select
              options={categoriesData?.categorySearch ?? []}
              values={category ? [category] : []}
              labelField="name"
              valueField="name"
              onChange={(v) => {
                if (v.length === 0) return;

                const categorySelect = v.at(0);
                if (!categorySelect) return;

                const spb = new URLSearchParams(urlParamsBuilder);
                spb.set("category", categorySelect.name);
                spb.set("categoryId", categorySelect.id.toString());
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
              onClearAll={() => {
                const spb = new URLSearchParams(urlParamsBuilder);
                spb.delete("categoryId");
                spb.delete("category");
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
              loading={categoriesLoading}
              clearable
              searchable
              placeholder="Select category"
              multi={false}
            />
          </div>

          <div>
            <Label>Store location</Label>

            <NativeSelect
              value={searchFilters.branchType ?? 'all'}
              onChange={(e) => {
                const val = e.target.value;
                const spb = new URLSearchParams(urlParamsBuilder);
                if (val === 'All') {
                  spb.delete("branchType");
                } else {
                  if (val === BranchType.Online) {
                    if (currentLocation && currentLocation.locationInput) {
                      const newLocation = { ...currentLocation };
                      newLocation.locationInput.radiusMeters = undefined;
                      setCurrentLocation(newLocation);
                    }
                  }
                  spb.set("branchType", val);
                }
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
            >
              <NativeSelectOption value="All">All - In store & Online</NativeSelectOption>
              <NativeSelectOption value={BranchType.Physical}>
                In Store
              </NativeSelectOption>
              <NativeSelectOption value={BranchType.Online}>
                Online
              </NativeSelectOption>
            </NativeSelect>
          </div>

          <div>
            <Label>Sort</Label>

            <NativeSelect
              value={searchFilters.sortByPrice ?? 'best'}
              onChange={(e) => {
                const val = e.target.value;
                const spb = new URLSearchParams(urlParamsBuilder);
                if (val === 'best') {
                  spb.delete("sortByPrice");
                } else {
                  spb.set("sortByPrice", val);
                }
                router.push(`${searchBaseUrl}?${spb.toString()}`);
              }}
            >
              <NativeSelectOption value="best">
                Best Match
              </NativeSelectOption>
              <NativeSelectOption value="asc">
                ↓ Price - Low to High
              </NativeSelectOption>
              <NativeSelectOption value="desc">
                ↑ Price - High to Low
              </NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2 mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant="pricetra"
              onClick={() => onOpenChange(false)}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
