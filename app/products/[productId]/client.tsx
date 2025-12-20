"use client";

import ProductPage, { ProductPageProps } from "./components/product-page";

export type ProductPageClientProps = ProductPageProps;

export default function ProductPageClient(props: ProductPageClientProps) {
  return <ProductPage {...props} />
}
