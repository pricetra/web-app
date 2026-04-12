"use client";

import {
  AllProductsDocument,
  Branch,
  BranchType,
  BranchesWithProductsDocument,
  CreatePrice,
  CreatePriceDocument,
  FavoriteBranchesWithPricesDocument,
  GetProductStocksDocument,
  GetStockFromProductAndBranchIdDocument,
  Product,
  Stock,
  StockDocument,
} from "graphql-utils";
import { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import ProductItem from "@/components/product-item";
import { PriceForm } from "@/components/product-form/add-price-form";
import { toast } from "sonner";
import { Formik, FormikErrors } from "formik";
import { CgSpinner } from "react-icons/cg";
import dayjs from "dayjs";

export type BranchPriceFormProps = {
  product: Product;
  branch: Branch;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BranchPriceForm({
  product,
  branch,
  onSuccess,
  onCancel,
}: BranchPriceFormProps) {
  const [getStock, { data: stockData, loading: stockLoading }] = useLazyQuery(
    GetStockFromProductAndBranchIdDocument,
    { fetchPolicy: "no-cache" },
  );
  const [createPrice, { loading }] = useMutation(CreatePriceDocument, {
    refetchQueries: [
      StockDocument,
      GetProductStocksDocument,
      FavoriteBranchesWithPricesDocument,
      BranchesWithProductsDocument,
      AllProductsDocument,
    ],
  });

  const stock = stockData?.getStockFromProductAndBranchId as Stock | undefined;

  useEffect(() => {
    getStock({
      variables: { productId: product.id, branchId: branch.id },
    });
  }, [product.id, branch.id, getStock]);

  if (stockLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <CgSpinner className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-5">
        <ProductItem
          product={{ ...product, stock }}
          branchSlug={branch.slug}
          hideAddButton
          hideStoreInfo
          imgWidth={100}
          preventHref
        />
      </div>

      <Formik
        validateOnBlur
        validateOnChange
        validateOnMount
        validate={(values) => {
          const errors = {} as FormikErrors<CreatePrice>;
          if (!values.amount) {
            errors.amount = "";
          }
          if (values.amount <= 0) {
            errors.amount = "Amount has to be higher than $0.00";
          }
          if (
            values.sale &&
            values.originalPrice &&
            values.originalPrice < values.amount
          ) {
            errors.originalPrice =
              "Original price cannot be smaller than the Sale price";
          }
          return errors;
        }}
        initialValues={
          {
            productId: product.id,
            branchId: branch.id,
            sale: false,
            unitType: "item",
          } as CreatePrice
        }
        onSubmit={(input) => {
          input.expiresAt = dayjs(input.expiresAt).toDate();
          createPrice({
            variables: {
              input: {
                ...input,
                branchId: branch.id,
              },
            },
          })
            .then(({ data }) => {
              if (!data) return;
              onSuccess();
            })
            .catch((e) => toast.error(e.message));
        }}
      >
        {(formik) => (
          <div className="flex flex-col gap-5">
            <PriceForm
              stock={stock}
              branch={branch}
              latestPrice={stock?.latestPrice ?? undefined}
            />

            <div className="mt-4">
              {formik.errors && (
                <div>
                  {Object.values(formik.errors).map((v, i) => (
                    <p className="text-red-700" key={i}>
                      {v.toString()}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-row items-center justify-end gap-5">
                <Button variant="outline" disabled={loading} onClick={onCancel}>
                  Cancel
                </Button>

                <Button
                  className="bg-pricetra-green-heavy-dark hover:bg-pricetra-green-heavy-dark-hover"
                  type="submit"
                  onClick={() => {
                    if (
                      formik.values.onlineItem &&
                      branch.type !== BranchType.Online
                    ) {
                      const confirm = window.confirm(
                        `Are you sure you want to add an online price to an in-store branch (${branch.name})?`,
                      );
                      if (!confirm) return;
                    }
                    formik.submitForm();
                  }}
                  disabled={loading || !formik.isValid}
                >
                  {loading ? (
                    <>
                      <CgSpinner className="animate-spin" />
                      Submitting
                    </>
                  ) : (
                    "Add Price"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
