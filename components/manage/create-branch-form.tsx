"use client";

import { useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import {
  AllBranchesDocument,
  CreateBranch,
  CreateBranchDocument,
  CreateBranchFromFullAddressDocument,
  Store,
} from "graphql-utils";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { toast } from "sonner";

type FormType = "fullAddress" | "onlineAddress";

export default function CreateBranchForm({
  store,
  onCreated,
  onCancel,
}: {
  store: Store;
  onCreated?: (branchId: number) => void;
  onCancel?: () => void;
}) {
  const [
    createBranchWithFullAddress,
    {
      loading: creatingBranchWithFullAddress,
      error: createBranchWithFullAddressError,
    },
  ] = useMutation(CreateBranchFromFullAddressDocument, {
    refetchQueries: [
      {
        query: AllBranchesDocument,
        variables: { storeSlug: store.slug, paginator: { limit: 20, page: 1 } },
      },
    ],
  });
  const [
    createBranch,
    {
      loading: creatingBranch,
      error: createBranchError,
    },
  ] = useMutation(CreateBranchDocument, {
    refetchQueries: [
      {
        query: AllBranchesDocument,
        variables: { storeSlug: store.slug, paginator: { limit: 20, page: 1 } },
      },
    ],
  });

  const [formType, setFormType] = useState<FormType>("fullAddress");
  const loading = creatingBranchWithFullAddress || creatingBranch;
  const errors = createBranchError || createBranchWithFullAddressError;

  const handleSubmit = async (values: CreateBranch) => {
    try {
      if (formType === "fullAddress") {
        const { data } = await createBranchWithFullAddress({
          variables: {
            storeId: store.id,
            fullAddress: values.name,
          },
        });
        if (data) {
          toast.success("Branch created successfully");
          onCreated?.(data.createBranchWithFullAddress.id);
        }
      } else {
        delete values.address;
        const { data } = await createBranch({
          variables: {
            input: { ...values, storeId: store.id },
          },
        });
        if (data) {
          toast.success("Branch created successfully");
          onCreated?.(data.createBranch.id);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Formik
      initialValues={
        { onlineAddress: {}, address: {}, storeId: store.id } as CreateBranch
      }
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <form className="flex flex-col gap-5">
          <NativeSelect
            value={formType}
            onChange={(e) => setFormType(e.target.value as FormType)}
            className="w-full"
          >
            <NativeSelectOption value="fullAddress">
              Full Address
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
                      placeholder="https://www.example.com"
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
                      placeholder="https://www.example.com/dp/[PRODUCT_ID]"
                      value={formik.values.onlineAddress?.itemUrlTemplate ?? ""}
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
                      value={formik.values.onlineAddress?.referralCode ?? ""}
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

          <div className="flex flex-row gap-3 justify-end">
            {onCancel && (
              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={() => formik.handleSubmit()}
              variant="pricetra"
              disabled={loading || !formik.isValid}
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Branch"
              )}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
