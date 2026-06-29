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
  Category,
  CategorySearchDocument,
  GetCategoryDocument,
} from "graphql-utils";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "./ui/custom-select";

export type ProductFiltersDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ProductFiltersDialog({
  open,
  onOpenChange,
}: ProductFiltersDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParamsBuilder = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );
  const { data: brandsData, loading: brandsLoading } = useQuery(
    AllBrandsDocument,
    { variables: { joinStock: true } },
  );
  const brand = searchParams.get("brand");
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    CategorySearchDocument,
    { variables: { search: "" } },
  );
  const [getCategory] = useLazyQuery(GetCategoryDocument);
  const [category, setCategory] = useState<Category>();
  const categoryId = searchParams.get("categoryId");

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
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription className="text-gray-600 text-xs">
            Update the search filters to refine your search results.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 my-5">
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
              router.push(`search?${spb.toString()}`);
            }}
            onClearAll={() => {
              const spb = new URLSearchParams(urlParamsBuilder);
              spb.delete("brand");
              router.push(`search?${spb.toString()}`);
            }}
            loading={brandsLoading}
            clearable
            searchable
            placeholder="Select brand"
            multi={false}
          />

          <Select
            options={categoriesData?.categorySearch ?? []}
            values={category ? [category] : []}
            labelField="name"
            valueField="id"
            onChange={(v) => {
              if (v.length === 0) return;

              const categorySelect = v.at(0);
              if (!categorySelect) return;

              const spb = new URLSearchParams(urlParamsBuilder);
              spb.set("category", categorySelect.name);
              spb.set("categoryId", categorySelect.id.toString());
              router.push(`search?${spb.toString()}`);
            }}
            onClearAll={() => {
              const spb = new URLSearchParams(urlParamsBuilder);
              spb.delete("categoryId");
              spb.delete("category");
              router.push(`search?${spb.toString()}`);
            }}
            loading={categoriesLoading}
            clearable
            searchable
            placeholder="Select category"
            multi={false}
          />
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
