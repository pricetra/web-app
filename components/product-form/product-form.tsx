import { Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import {
  AllBrandsDocument,
  AllProductsDocument,
  Brand,
  CreateProduct,
  CreateProductDocument,
  UpdateProductDocument,
  Product,
  ProductDocument,
} from "graphql-utils";
import { diffObjects } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client/react";
import { ErrorLike } from "@apollo/client";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CategoryInput from "./category-input";
import { Checkbox } from "@/components/ui/checkbox";
import WeightSelector from "./weight-input";

export type ProductFormProps = {
  upc?: string;
  product?: Product;
  onCancel: (formik: FormikHelpers<CreateProduct>) => void;
  onSuccess: (product: Product, formik: FormikHelpers<CreateProduct>) => void;
  onError: (e: ErrorLike, formik: FormikHelpers<CreateProduct>) => void;
};

export default function ProductForm({
  upc,
  product,
  onCancel,
  onSuccess,
  onError,
}: ProductFormProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [imageBase64, setImageBase64] = useState<string>();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [brands, setBrands] = useState<Brand[]>();
  const { data: brandsData, loading: brandsLoading } = useQuery(
    AllBrandsDocument,
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateProduct, { loading: updateLoading }] = useMutation(
    UpdateProductDocument,
    {
      refetchQueries: [AllProductsDocument, AllBrandsDocument, ProductDocument],
    }
  );
  const [createProduct, { loading: createLoading }] = useMutation(
    CreateProductDocument,
    {
      refetchQueries: [AllProductsDocument, AllBrandsDocument],
    }
  );
  const loading = updateLoading || createLoading;
  const isUpdateProduct =
    product !== undefined && product.id !== undefined && product.id !== 0;

  useEffect(() => {
    if (!product) return;

    if (product.image && product.image !== "") {
      setImageUri(product.image);
    } else {
      setImageUri(undefined);
    }
  }, [product]);

  useEffect(() => {
    if (!brandsData) return;
    setBrands(brandsData.allBrands);
  }, [brandsData]);

  // async function selectImage() {
  //   const picture = await selectImageForProductExtraction();
  //   if (!picture) return;

  //   setImageUpdated(true);
  //   setImageUri(picture.imageUri);
  //   setImageBase64(picture.base64);
  // }

  function resetImage() {
    setImageUri(undefined);
    setImageBase64(undefined);
    setImageUpdated(false);
  }

  function submit(input: CreateProduct, formik: FormikHelpers<CreateProduct>) {
    const imageAdded = imageUri && imageBase64 && imageUpdated;

    if (input.weight === "") input.weight = undefined;
    if (!input.description) input.description = "";

    if (imageAdded) input.imageBase64 = imageBase64;

    if (isUpdateProduct) {
      const filteredInput = diffObjects(input, product);
      if (Object.keys(filteredInput).length === 0 && !imageAdded) return;

      updateProduct({
        variables: {
          id: product.id,
          input: filteredInput,
        },
      })
        .then(({ data, error }) => {
          if (error) return onError(error, formik);
          if (!data) return;

          resetImage();
          onSuccess(data.updateProduct as Product, formik);
        })
        .catch((e) => onError(e, formik));
      return;
    }

    createProduct({
      variables: {
        input,
      },
    })
      .then(({ data, error }) => {
        if (error) return onError(error, formik);
        if (!data) return;

        resetImage();
        onSuccess(data.createProduct as Product, formik);
      })
      .catch((e) => onError(e, formik));
  }

  function renderImageSelection() {
    if (imageUri) {
      return (
        <Image
          src={imageUri}
          className="size-28 rounded-lg object-cover"
          width={500}
          height={500}
          alt="Product image"
        />
      );
    }
    return (
      <div className="flex size-28 items-center justify-center rounded-xl bg-gray-400">
        <FiCamera className="size-[35px]" />
      </div>
    );
  }

  if (brandsLoading || !brands)
    return (
      <div className="flex h-40 items-center justify-center p-10">
        <CgSpinner className="animate-spin size-16" />
      </div>
    );

  return (
    <Formik
      enableReinitialize
      initialValues={
        {
          ...product,
          code: product?.code ?? upc ?? "",
          weight:
            product?.weightValue && product?.weightType
              ? `${product.weightValue} ${product.weightType}`
              : undefined,
          quantityValue: product?.quantityValue ?? "1",
        } as CreateProduct
      }
      onSubmit={submit}
    >
      {(formik) => (
        <div className="grid w-full gap-4 text-black">
          <InputGroup>
            <InputGroupInput
              value={formik.values.code}
              id="code"
              readOnly
              disabled
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput
              placeholder="Product brand name"
              value={formik.values.brand}
              onChange={(e) => formik.setFieldValue("brand", e.target.value)}
              id="brand"
            />
            <InputGroupAddon align="block-start">
              <Label className="text-xs" htmlFor="brand">
                Brand
              </Label>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupTextarea
              placeholder="Product name (Ex. Great Value Whole Milk 128 fl oz"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
              id="name"
            />
            <InputGroupAddon align="block-start">
              <Label className="text-xs" htmlFor="name">
                Product Name
              </Label>
            </InputGroupAddon>
          </InputGroup>

          <div className="my-5">{renderImageSelection()}</div>

          <div className="mb-5">
            <Label className="mb-2 block">Category</Label>
            <CategoryInput
              category={product?.category ?? undefined}
              onSelectCategoryId={(categoryId) => {
                console.log(categoryId);
                formik.setFieldValue("categoryId", categoryId);
              }}
            />
          </div>

          <InputGroup>
            <InputGroupTextarea
              placeholder="Description with keywords"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              id="description"
            />
            <InputGroupAddon align="block-start">
              <Label className="text-xs" htmlFor="description">
                Product Description
              </Label>
            </InputGroupAddon>
          </InputGroup>

          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex-1">
              <InputGroup>
                <InputGroupInput
                  placeholder="Product quantity"
                  value={formik.values.quantityValue ?? 1}
                  onChange={(e) =>
                    formik.setFieldValue("quantityValue", e.target.value)
                  }
                  id="quantityValue"
                />
                <InputGroupAddon align="block-start">
                  <Label className="text-xs" htmlFor="quantityValue">
                    Quantity
                  </Label>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <InputGroup>
                <InputGroupInput
                  value={formik.values.quantityType ?? "count"}
                  onChange={(e) =>
                    formik.setFieldValue("quantityType", e.target.value)
                  }
                  id="quantityType"
                />
                <InputGroupAddon align="block-start">
                  <Label className="text-xs" htmlFor="quantityType">
                    Unit
                  </Label>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className="mt-2 mb-4 flex flex-col gap-2">
            <div className="flex flex-1 flex-row items-center justify-center gap-3 ">
              <WeightSelector
                onChangeText={(v) => {
                  if (!v.weightType || !v.weightValue) {
                    formik.setFieldValue("weight", "");
                    return;
                  }
                  formik.setFieldValue(
                    "weight",
                    `${v.weightValue} ${v.weightType}`
                  );
                }}
                value={formik.values.weight ?? undefined}
              />
            </div>

            <div className="flex flex-row flex-wrap items-center gap-5">
              <div className="flex flex-row items-center gap-1">
                <Checkbox
                  id="netWeight"
                  checked={formik.values.netWeight ?? false}
                  onCheckedChange={(c: boolean) =>
                    formik.setFieldValue("netWeight", c)
                  }
                />
                <Label htmlFor="netWeight">Net weight</Label>
              </div>

              <div className="flex flex-row items-center gap-1">
                <Checkbox
                  id="approximateWeight"
                  checked={formik.values.approximateWeight ?? false}
                  onCheckedChange={(c: boolean) =>
                    formik.setFieldValue("approximateWeight", c)
                  }
                />
                <Label htmlFor="approximateWeight">Approximate weight</Label>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-row items-center justify-end gap-5">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onCancel(formik)}
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
                <>{isUpdateProduct ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
}

export type ExtractionImageSelectionType = {
  imageUri: string;
  base64: string;
  base64EncodingOnly?: string;
};

// export async function selectImageForProductExtraction(
//   useCamera: boolean = false,
//   quality: number = 1
// ): Promise<ExtractionImageSelectionType | undefined> {
//   const options: ImagePicker.ImagePickerOptions = {
//     mediaTypes: ['images'],
//     allowsEditing: true,
//     aspect: [1, 1],
//     quality,
//     base64: true,
//     allowsMultipleSelection: false,
//     cameraType: ImagePicker.CameraType.back,
//   };
//   const result = await (useCamera
//     ? ImagePicker.launchCameraAsync(options)
//     : ImagePicker.launchImageLibraryAsync(options));

//   if (result.canceled || result.assets.length === 0) return undefined;

//   const picture = result.assets.at(0);
//   if (!picture || !picture.base64 || !picture.uri) return undefined;

//   return {
//     imageUri: picture.uri,
//     base64: buildBase64ImageString(picture),
//     base64EncodingOnly: picture.base64,
//   };
// }
