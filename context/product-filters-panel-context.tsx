import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@apollo/client/react";
import { AllBrandsDocument } from "graphql-utils";
import Select from "react-dropdown-select";
import { useRouter, useSearchParams } from "next/navigation";

export type ProductFiltersPanelContextType = {
  panelOpen: boolean;
  togglePanel: (open?: boolean) => void;
};

export const ProductFiltersPanelContext = createContext(
  {} as ProductFiltersPanelContextType,
);

export default function ProductFiltersPanelContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParamsBuilder = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const { data: brandsData, loading: brandsLoading } = useQuery(
    AllBrandsDocument,
    { variables: { joinStock: true } },
  );
  const brand = searchParams.get("brand");

  return (
    <ProductFiltersPanelContext.Provider
      value={{
        panelOpen,
        togglePanel: (open?: boolean) =>
          setPanelOpen((panelOpen) => open ?? !panelOpen),
      }}
    >
      <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
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
            />
          </div>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>

      {children}
    </ProductFiltersPanelContext.Provider>
  );
}

export const useProductFiltersPanel = () =>
  useContext(ProductFiltersPanelContext);
