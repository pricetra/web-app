import { Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  AllBrandsDocument,
  AllProductsDocument,
  Brand,
  CreateProduct,
  CreateProductDocument,
  UpdateProductDocument,
  Product,
  ProductDocument,
  ExtractProductFieldsDocument,
  SanitizeProductDocument,
  Category,
} from "graphql-utils";
import { diffObjects } from "@/lib/utils";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
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
import {
  allowedImageTypes,
  allowedImageTypesString,
} from "@/constants/uploads";
import { MdCameraEnhance, MdFormatSize } from "react-icons/md";
import { titleCase } from "@/lib/strings";
import { convertFileToBase64 } from "@/lib/files";
import { FaHandSparkles } from "react-icons/fa";

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
  const [selectedImage, setSelectedImage] = useState<string>();
  const [brands, setBrands] = useState<Brand[]>();
  const { data: brandsData, loading: brandsLoading } = useQuery(
    AllBrandsDocument,
    {
      fetchPolicy: "network-only",
    },
  );
  const [updateProduct, { loading: updateLoading }] = useMutation(
    UpdateProductDocument,
    {
      refetchQueries: [AllProductsDocument, AllBrandsDocument, ProductDocument],
    },
  );
  const [createProduct, { loading: createLoading }] = useMutation(
    CreateProductDocument,
    {
      refetchQueries: [AllProductsDocument, AllBrandsDocument],
    },
  );
  const productImageUploadRef = useRef<HTMLInputElement>(null);
  const loading = updateLoading || createLoading;
  const isUpdateProduct =
    product !== undefined && product.id !== undefined && product.id !== 0;

  const [extractProductFields, { loading: analyzingImage }] = useLazyQuery(
    ExtractProductFieldsDocument,
    {
      fetchPolicy: "no-cache",
    },
  );
  const autofillWithImageRef = useRef<HTMLInputElement>(null);

  const [sanitizeProduct, { loading: sanitizing }] = useMutation(
    SanitizeProductDocument,
    {
      refetchQueries: [ProductDocument],
    },
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    if (!brandsData) return;
    setBrands(brandsData.allBrands);
  }, [brandsData]);

  useEffect(() => {
    if (!product) return;
    setSelectedImage(product.image);
  }, [product]);

  useEffect(() => {
    if (product?.category?.id !== selectedCategory?.id)
      setSelectedCategory(product?.category ?? undefined);
  }, [product?.category, selectedCategory])

  async function onPressAutofill(
    formik: FormikProps<CreateProduct>,
    base64Image: string,
  ) {
    const { data, error } = await extractProductFields({
      variables: {
        base64Image: base64Image,
      },
    });
    if (error || !data) {
      window.alert(
        `Could not auto-fill using the provided image. ${
          error?.message ?? "No data found"
        }`,
      );
      return;
    }

    const extractedFields = data.extractProductFields;
    formik.setFieldValue("brand", extractedFields.brand);
    formik.setFieldValue("name", extractedFields.name);
    formik.setFieldValue("description", extractedFields.description);
    if (extractedFields.weight) {
      formik.setFieldValue("weight", extractedFields.weight);
    }
    if (extractedFields.quantity) {
      formik.setFieldValue("quantityValue", extractedFields.quantity);
    }
    if (extractedFields.netWeight) {
      formik.setFieldValue("netWeight", extractedFields.netWeight);
    }
    if (extractedFields.categoryId && extractedFields.category) {
      formik.setFieldValue("categoryId", extractedFields.categoryId);
    }
  }

  function submit(input: CreateProduct, formik: FormikHelpers<CreateProduct>) {
    if (input.weight === "") input.weight = undefined;
    if (!input.description) input.description = "";

    if (isUpdateProduct) {
      const filteredInput = diffObjects(input, product);
      if (Object.keys(filteredInput).length === 0) return;

      updateProduct({
        variables: {
          id: product.id,
          input: filteredInput,
        },
      })
        .then(({ data, error }) => {
          if (error) return onError(error, formik);
          if (!data) return;

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

        onSuccess(data.createProduct as Product, formik);
      })
      .catch((e) => onError(e, formik));
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

          <div className="flex flex-row flex-wrap gap-3 mb-5">
            <Button
              onClick={() => {
                autofillWithImageRef.current?.click();
              }}
              disabled={analyzingImage}
              className="border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
            >
              {analyzingImage ? (
                <CgSpinner className="animate-spin" />
              ) : (
                <MdCameraEnhance />
              )}
              Autofill with Image
            </Button>

            <div className="hidden">
              <input
                ref={autofillWithImageRef}
                type="file"
                accept={allowedImageTypesString}
                onChange={async (e) => {
                  const files = e.target.files;
                  const file = files?.item(0);
                  if (!file) return;
                  if (!allowedImageTypes.includes(file.type)) {
                    window.alert("invalid file type");
                    return;
                  }

                  const base64Image = await convertFileToBase64(file);
                  if (!base64Image) {
                    window.alert("Could not handle file to base64 conversion");
                    return;
                  }
                  onPressAutofill(formik, base64Image.toString());
                }}
              />
            </div>

            {product && (
              <Button
                onClick={() =>
                  sanitizeProduct({ variables: { id: product.id } }).then(
                    ({ data }) => {
                      if (!data) return;
                      onSuccess(data.sanitizeProduct as Product, formik);
                    },
                  )
                }
                disabled={sanitizing}
                className="border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-600"
              >
                {sanitizing ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <FaHandSparkles />
                )}
                Sanitize with AI
              </Button>
            )}

            <Button
              onClick={() => {
                formik.setFieldValue("name", titleCase(formik.values.name));
              }}
              className="border border-purple-300 text-purple-600 bg-purple-50 hover:bg-purple-100"
            >
              <MdFormatSize />
              Title Case
            </Button>
          </div>

          <div className="my-5">
            {selectedImage ? (
              <Image
                src={selectedImage}
                className="size-28 rounded-lg object-cover cursor-pointer"
                width={500}
                height={500}
                alt="Product image"
                onClick={() => productImageUploadRef.current?.click()}
                onError={() => setSelectedImage(undefined)}
              />
            ) : (
              <div
                className="flex size-28 items-center justify-center rounded-xl bg-gray-400 cursor-pointer"
                onClick={() => productImageUploadRef.current?.click()}
              >
                <FiCamera className="size-[35px] text-white" />
              </div>
            )}
            <div className="hidden">
              <input
                ref={productImageUploadRef}
                type="file"
                accept={allowedImageTypesString}
                onChange={(e) => {
                  const files = e.target.files;
                  const file = files?.item(0);
                  if (!file) return;
                  if (!allowedImageTypes.includes(file.type)) {
                    window.alert("invalid file type");
                    return;
                  }

                  formik.setFieldValue("imageFile", file);
                  setSelectedImage(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div className="mb-5">
            <Label className="mb-2 block">Category</Label>
            <CategoryInput
              category={selectedCategory}
              onSelectCategory={(category) => {
                formik.setFieldValue("categoryId", category.id);
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
            <div className="flex-2">
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

            <div className="flex-1">
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
                    `${v.weightValue} ${v.weightType}`,
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
