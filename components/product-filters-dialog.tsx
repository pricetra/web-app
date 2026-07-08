import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import ProductFiltersOptions from "./product-filters-options";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription className="text-gray-600 text-xs">
            Update the search filters to refine your search results.
          </DialogDescription>
        </DialogHeader>

        <div className="my-5">
          <ProductFiltersOptions searchBaseUrl={searchBaseUrl} />
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
