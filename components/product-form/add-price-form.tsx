import useLocationService from "@/hooks/useLocation";
import {
  BranchesWithProductsDocument,
  CreatePrice,
  CreatePriceDocument,
  FavoriteBranchesWithPricesDocument,
  FindBranchesByDistanceDocument,
  GetProductStocksDocument,
  GetStockFromProductAndBranchIdDocument,
  Price,
  Product,
  Stock,
  StockDocument,
  UserRole,
} from "graphql-utils";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { isRoleAuthorized } from "@/lib/roles";
import { useAuth } from "@/context/user-context";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from "next/navigation";
import ProductItem from "@/components/product-item";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Formik, FormikErrors, useFormikContext } from "formik";
import dayjs from "dayjs";
import { ErrorLike } from "@apollo/client";
import { Input } from "@/components/ui/input";

export type AddPriceFormProps = {
  product: Product;
  onCancel: () => void;
  onSuccess: (p: Price) => void;
  onError: (e: ErrorLike) => void;
};

export default function AddPriceForm({
  product,
  onSuccess,
  onError,
  onCancel,
}: AddPriceFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { permissionGranted, location, getCurrentGeocodeAddress } =
    useLocationService();
  const [
    findBranchesByDistance,
    { data: branchesData, loading: branchesLoading },
  ] = useLazyQuery(FindBranchesByDistanceDocument, { fetchPolicy: "no-cache" });
  const [getStock, { data: stockData }] = useLazyQuery(
    GetStockFromProductAndBranchIdDocument,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [createPrice, { loading }] = useMutation(CreatePriceDocument, {
    refetchQueries: [
      StockDocument,
      GetProductStocksDocument,
      FavoriteBranchesWithPricesDocument,
      BranchesWithProductsDocument,
    ],
  });
  const stock = stockData?.getStockFromProductAndBranchId as Stock | undefined;
  const [branchId, setBranchId] = useState<number>();
  const selectedBranch = useMemo(
    () =>
      branchId
        ? branchesData?.findBranchesByDistance?.find(
            ({ id }) => branchId === id
          )
        : undefined,
    [branchId, branchesData]
  );

  const nextWeek = dayjs(new Date()).add(7, "day").toDate();

  useEffect(() => {
    if (!location || !user) return;

    findBranchesByDistance({
      variables: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radiusMeters: isRoleAuthorized(UserRole.Admin, user.role)
          ? 18_000
          : 500,
      },
    }).then(({ data }) => {
      if (!data) return;
      if (data.findBranchesByDistance.length === 0) return;
      setBranchId(data.findBranchesByDistance.at(0)!.id);
    });
  }, [findBranchesByDistance, location, user]);

  useEffect(() => {
    if (!branchId) return;
    getStock({
      variables: {
        productId: product.id,
        branchId,
      },
    });
  }, [branchId, getStock, product.id]);

  if (branchesLoading)
    return (
      <div className="flex h-40 items-center justify-center p-10">
        <CgSpinner className="animate-spin size-16" />
      </div>
    );

  if (!location || !permissionGranted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-10">
        <h3 className="text-lg">Adding prices requires Location access</h3>
        <Button onClick={() => getCurrentGeocodeAddress()}>
          Request Location
        </Button>
      </div>
    );
  }

  if (!branchesData || branchesData.findBranchesByDistance.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-10">
        <h3 className="text-lg">No branches found near you</h3>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 mb-5">
        <ProductItem
          product={{
            ...product,
            stock,
          }}
          hideAddButton
          hideStoreInfo
          imgWidth={100}
        />
      </div>

      <div className="mb-7 flex flex-row items-center gap-2 w-full">
        {branchId && selectedBranch && (
          <Image
            src={createCloudinaryUrl(
              selectedBranch.store?.logo ?? "",
              500,
              500
            )}
            className="size-[35px] rounded-lg border border-gray-200"
            width={100}
            height={100}
            quality={100}
            alt={selectedBranch.name}
          />
        )}

        <div className="flex-1">
          <NativeSelect
            value={branchId}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (isNaN(val)) return;

              setBranchId(val);
            }}
            className="w-full"
          >
            {branchesData.findBranchesByDistance.map((branch) => (
              <NativeSelectOption
                value={branch.id}
                key={`branch-option-${branch.id}`}
              >
                {branch.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      {branchId && selectedBranch && (
        <Formik
          validateOnBlur
          validateOnChange
          validate={(values) => {
            const errors = {} as FormikErrors<CreatePrice>;
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
              branchId: +branchId,
              amount: 0.0,
              sale: false,
              expiresAt: nextWeek,
              unitType: "item",
            } as CreatePrice
          }
          onSubmit={(input) => {
            createPrice({
              variables: {
                input: {
                  ...input,
                  branchId: +branchId,
                },
              },
            })
              .then(({ data }) => {
                if (!data) return;
                onSuccess(data.createPrice as Price);
              })
              .catch((e) => onError(e));
          }}
        >
          {(formik) => (
            <div className="flex flex-col gap-5">
              <div>
                <PriceForm latestPrice={stock?.latestPrice ?? undefined} />
              </div>

              <div className="mt-7">
                {formik.errors && (
                  <div>
                    {Object.values(formik.errors).map((v, i) => (
                      <p className="text-red-700" key={i}>
                        {v.toString()}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-row items-center justify-end gap-5">
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="bg-pricetra-green-heavy-dark hover:bg-pricetra-green-heavy-dark-hover"
                    type="submit"
                    onClick={formik.submitForm}
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
      )}
    </div>
  );
}

type PriceFormProps = {
  // formik: FormikProps<CreatePrice>;
  latestPrice?: Price;
};

function PriceForm({ latestPrice }: PriceFormProps) {
  const formikContext = useFormikContext<CreatePrice>();
  const [rawAmount, setRawAmount] = useState("");

  useEffect(() => {
    if (!latestPrice) return;

    formikContext.setValues({
      ...formikContext.values,
      amount: latestPrice.amount,
      sale: latestPrice.sale,
      originalPrice: latestPrice.originalPrice,
      condition: latestPrice.condition,
      unitType: latestPrice.unitType,
    });
  }, [formikContext, latestPrice]);

  useEffect(() => {
    const strAmount = String(formikContext.values.amount);
    if (rawAmount !== strAmount) return;
    setRawAmount(strAmount);
  }, [rawAmount, formikContext.values.amount]);

  return (
    <>
      <div className="flex flex-row items-center gap-5">
        <Input
          placeholder="Current product price"
          value={rawAmount}
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            setRawAmount(value);

            // parse and set "amount" field
            const parsedValue = parseFloat(value);
            const amount = isNaN(parsedValue) ? 0 : parsedValue;
            formikContext.setFieldValue("amount", amount);
          }}
        />
      </div>
    </>
  );
}
