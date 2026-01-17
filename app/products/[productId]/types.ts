export type ProductPageParams = {
  productId: string;
  branch?: string;
};

export type ProductPageSearchParams = {
  stockId?: string;
  sharedBy?: string;
  sharedFrom?: string;
  ref?: string;
};
