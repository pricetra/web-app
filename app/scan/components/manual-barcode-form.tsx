import { Input } from "@/components/ui/input";

export default function ManualBarcodeForm() {
  return (
    <div>
      <Input
        type="text"
        placeholder="Ex. Barcode, Product name, Category, etc."
      />
    </div>
  );
}
