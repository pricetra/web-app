"use client";

import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import {
  BusinessForm,
  CreateStore,
  CreateStoreDocument,
  CreateStoreWithBusinessFormDocument,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgCheckO, CgCloseO, CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import slugify from "slugify";
import useStoreNameAvailability from "@/hooks/useStoreNameAvailability";
import { RiImageCircleFill } from "react-icons/ri";
import Image from "next/image";
import { convertFileToBase64 } from "@/lib/files";
import { allowedImageTypes } from "@/constants/uploads";
import { Button } from "@/components/ui/button";

export type AddStoreClientProps = {
  businessFormId?: string;
  businessForm?: BusinessForm;
};

export default function AddStoreClient({
  businessFormId,
}: AddStoreClientProps) {
  const router = useRouter();
  const [createStoreWithBusinessForm, { loading: creatingBusinessFormStore }] =
    useMutation(CreateStoreWithBusinessFormDocument);
  const [createStore, { loading: creatingStore }] =
    useMutation(CreateStoreDocument);
  const {
    debouncedCheckStoreNameAvailability,
    storeNameAvailable,
    storeNameAvailabilityLoading,
  } = useStoreNameAvailability();
  const logoUploadInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(() => {
    if (!businessFormId) return;

    createStoreWithBusinessForm({
      variables: {
        id: businessFormId,
      },
    })
      .then(({ data }) => {
        if (!data) return;

        const { store, branch, businessForm } =
          data.createStoreWithBusinessForm;
        toast.success(
          `New store ${store.name} was added for ${businessForm.firstName} ${businessForm.lastName} (${businessForm.email})! Redirecting.`,
        );
        router.push(`/stores/${store.slug}/${branch.slug}`);
      })
      .catch((err) => {
        if (!err) return;
        toast.error(err.toString());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessFormId]);

  if (creatingBusinessFormStore) {
    return (
      <div className="w-full py-10">
        <div className="flex flex-col gap-5 items-center">
          <CgSpinner className="animate-spin size-16" />
          <h3>Processing invite</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Formik
        initialValues={{ name: "", website: "" } as CreateStore}
        onSubmit={(values) => {
          createStore({
            variables: {
              input: values,
            },
          }).then(({ data }) => {
            if (!data) return;

            toast.success(`New store ${data.createStore.name} was added!`);
            // router.push(`/stores/${store.slug}`);
          });
        }}
      >
        {(formik) => (
          <form className="max-w-lg mx-auto flex flex-col gap-5 py-10">
            <Field>
              <FieldLabel htmlFor="logoBase64" className="items-end">
                Logo <small className="text-gray-500">(1:1)</small>
              </FieldLabel>

              <div>
                {selectedImage ? (
                  <Image
                    src={selectedImage ?? ""}
                    className="size-20 rounded-xl object-cover cursor-pointer"
                    width={500}
                    height={500}
                    alt="Product image"
                    onClick={() => logoUploadInputRef.current?.click()}
                    onError={() => setSelectedImage(undefined)}
                  />
                ) : (
                  <div
                    className="flex size-20 items-center justify-center rounded-xl bg-gray-100/50 hover:bg-gray-100 cursor-pointer border border-gray-200/50"
                    onClick={() => logoUploadInputRef.current?.click()}
                  >
                    <RiImageCircleFill className="size-14 text-gray-500 hover:text-gray-600" />
                  </div>
                )}
              </div>

              <input
                type="file"
                name="logoBase64"
                ref={logoUploadInputRef}
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  const file = files?.item(0);
                  if (!file) return;
                  if (!allowedImageTypes.includes(file.type)) {
                    window.alert("invalid file type");
                    return;
                  }

                  setSelectedImage(URL.createObjectURL(file));
                  convertFileToBase64(file).then((base64File) => {
                    if (!base64File) return;
                    formik.setFieldValue("logoBase64", base64File.toString());
                  });
                }}
              />
            </Field>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Store Name</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    id="name"
                    placeholder="Walmart"
                    value={formik.values.name}
                    onChange={(v) => {
                      formik.setFieldValue("name", v.target.value);
                      debouncedCheckStoreNameAvailability(v.target.value);
                    }}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    {storeNameAvailabilityLoading && (
                      <CgSpinner className="animate-spin" />
                    )}
                    {storeNameAvailable !== undefined && (
                      <>
                        {storeNameAvailable && formik.values.name.length > 0 ? (
                          <CgCheckO className="text-green-700" />
                        ) : (
                          <CgCloseO className="text-red-700" />
                        )}
                      </>
                    )}
                  </InputGroupAddon>
                </InputGroup>

                {formik.values.name.length > 0 && (
                  <FieldDescription>
                    pricetra.com/stores/
                    <b className="text-zinc-700">
                      {slugify(formik.values.name, { lower: true })}
                    </b>
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="website">Website</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    id="website"
                    placeholder="https://www.walmart.com/"
                    value={formik.values.website}
                    onChange={(v) =>
                      formik.setFieldValue("website", v.target.value)
                    }
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>

            <Field orientation="horizontal" className="gap-5 justify-end">
              <Button
                onClick={() => formik.handleSubmit()}
                variant="pricetra"
                className="font-bold"
                disabled={creatingStore || !formik.isValid}
              >
                {creatingStore ? (
                  <>
                    <CgSpinner className="animate-spin" /> Submitting
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
              {/* <Button
                variant="outline"
                type="button"
                size="lg"
                disabled={creatingStore}
                onClick={onCancel}
              >
                Cancel
              </Button> */}
            </Field>
          </form>
        )}
      </Formik>
    </div>
  );
}
