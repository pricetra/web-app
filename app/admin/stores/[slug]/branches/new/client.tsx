"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Formik } from "formik";
import {
  CreateBranch,
  CreateBranchDocument,
  CreateBranchFromFullAddressDocument,
  FindStoreDocument,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import StoreMini from "@/components/store-mini";

type FormType = "fullAddress" | "rawAddress" | "onlineAddress";

export type NewBranchClientProps = {
  storeSlug: string;
};

export default function NewBranchClient({ storeSlug }: NewBranchClientProps) {
  const router = useRouter();
  const { data: storeData, loading: storeLoading } = useQuery(
    FindStoreDocument,
    { variables: { storeSlug } },
  );
  const [
    createBranchWithFullAddress,
    {
      data: createBranchWithFullAddressData,
      loading: creatingBranchWithFullAddress,
      error: createBranchWithFullAddressError,
    },
  ] = useMutation(CreateBranchFromFullAddressDocument);
  const [
    createBranch,
    {
      data: createBranchData,
      loading: creatingBranch,
      error: createBranchError,
    },
  ] = useMutation(CreateBranchDocument);

  const [formType, setFormType] = useState<FormType>("fullAddress");
  const loading = creatingBranchWithFullAddress || creatingBranch;
  const createdBranch =
    createBranchData?.createBranch ||
    createBranchWithFullAddressData?.createBranchWithFullAddress;
  const errors = createBranchError || createBranchWithFullAddressError;

  useEffect(() => {
    if (!storeData || !createdBranch) return;
    router.push(
      `/admin/stores/${storeData.findStore.slug}/branches/${createdBranch.id}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeData, createdBranch]);

  if (storeLoading || !storeData) {
    return (
      <div className="w-full py-10 flex justify-center">
        <CgSpinner className="animate-spin size-10" />
      </div>
    );
  }

  const store = storeData.findStore;

  return (
    <div className="flex-1 px-5">
      <Formik
        initialValues={
          { onlineAddress: {}, address: {}, storeId: store.id } as CreateBranch
        }
        onSubmit={(values) => {
          switch (formType) {
            case "fullAddress":
              createBranchWithFullAddress({
                variables: {
                  storeId: store.id,
                  fullAddress: values.name,
                },
              });
              break;
            default:
              if (formType === "onlineAddress") {
                delete values.address;
              }
              if (formType === "rawAddress") {
                delete values.onlineAddress;
              }
              createBranch({
                variables: {
                  input: {
                    ...values,
                    storeId: store.id,
                  },
                },
              });
              break;
          }
        }}
      >
        {(formik) => (
          <form className="max-w-lg mx-auto flex flex-col gap-5 py-10">
            <div className="flex flex-row mb-5">
              <StoreMini store={store} />
            </div>

            <NativeSelect
              value={formType}
              onChange={(e) => {
                const val = e.target.value as FormType;
                setFormType(val);
              }}
              className="w-full"
            >
              <NativeSelectOption value="fullAddress">
                Full Address
              </NativeSelectOption>
              <NativeSelectOption value="rawAddress">
                Raw Address
              </NativeSelectOption>
              <NativeSelectOption value="onlineAddress">
                Online Address
              </NativeSelectOption>
            </NativeSelect>

            {formType === "fullAddress" && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fullAddress">Full Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="fullAddress"
                      placeholder="123 Main St, City, State, Country"
                      value={formik.values.name}
                      onChange={(v) =>
                        formik.setFieldValue("name", v.target.value)
                      }
                      required
                    />
                  </InputGroup>
                </Field>
              </FieldGroup>
            )}

            {formType === "rawAddress" && <></>}

            {formType === "onlineAddress" && (
              <>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Branch Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="name"
                        placeholder="Amazon Online"
                        value={formik.values.name}
                        onChange={(v) =>
                          formik.setFieldValue("name", v.target.value)
                        }
                        required
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="url">URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="url"
                        placeholder="https://www.amazon.com"
                        value={formik.values.onlineAddress?.url ?? ""}
                        onChange={(v) => {
                          const value = v.target.value;
                          formik.setFieldValue("onlineAddress.url", value);
                          formik.setFieldValue(
                            "onlineAddress.itemUrlTemplate",
                            `${value ?? ""}/[PRODUCT_ID]`,
                          );
                        }}
                        required
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="itemUrlTemplate">
                      Product Item URL Template
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="itemUrlTemplate"
                        placeholder="https://www.amazon.com/dp/[PRODUCT_ID]"
                        value={
                          formik.values.onlineAddress?.itemUrlTemplate ?? ""
                        }
                        onChange={(v) =>
                          formik.setFieldValue(
                            "onlineAddress.itemUrlTemplate",
                            v.target.value,
                          )
                        }
                        required
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="referralCode">
                      Referral Code (optional)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="referralCode"
                        placeholder="pricetra-20"
                        value={
                          formik.values.onlineAddress?.referralCode ?? ""
                        }
                        onChange={(v) =>
                          formik.setFieldValue(
                            "onlineAddress.referralCode",
                            v.target.value,
                          )
                        }
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="referralQueryParam">
                      Referral Query Param (optional)
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="referralQueryParam"
                        placeholder="tag=pricetra-20"
                        value={
                          formik.values.onlineAddress?.referralQueryParam ?? ""
                        }
                        onChange={(v) =>
                          formik.setFieldValue(
                            "onlineAddress.referralQueryParam",
                            v.target.value,
                          )
                        }
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>
              </>
            )}

            {errors && (
              <p className="text-red-700">
                {errors.name}: {errors.message}
              </p>
            )}

            <Field orientation="horizontal" className="gap-5 justify-end">
              <Button
                onClick={() => formik.handleSubmit()}
                variant="pricetra"
                className="font-bold"
                disabled={loading || !formik.isValid}
              >
                {loading ? (
                  <>
                    <CgSpinner className="animate-spin" /> Submitting
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>

              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() =>
                  router.push(`/admin/stores/${storeSlug}/branches`)
                }
              >
                Cancel
              </Button>
            </Field>
          </form>
        )}
      </Formik>
    </div>
  );
}
