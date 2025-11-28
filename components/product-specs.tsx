import { Product } from "graphql-utils/types/graphql";

export type ProductSpecsProps = {
  product: Product;
};

export default function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <>
      {[
        { name: "ID", value: product.id.toString() },
        { name: "UPC/PLU Code", value: product.code },
        { name: "Product Name", value: product.name },
        { name: "Brand", value: product.brand },
        {
          name: "Weight",
          value:
            product.weightValue && product.weightType
              ? `${product.weightValue} ${product.weightType}`
              : "N/A",
        },
        { name: "Image URL", value: product.image },
        { name: "Views", value: product.views.toString() },
        { name: "Category", value: product.category?.name },
        { name: "Category ID", value: product.categoryId.toString() },
      ].map(({ name, value }) => (
        <div
          className="flex flex-row flex-wrap gap-3 border-b border-gray-100 py-2 last:border-0"
          key={name}
        >
          <h5 className="font-bold">{name}:</h5>
          <span className="block">{value}</span>
        </div>
      ))}
    </>
  );
}
