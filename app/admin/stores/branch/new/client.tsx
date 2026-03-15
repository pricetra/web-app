"use client";

import { useLazyQuery, useMutation } from "@apollo/client/react";
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
import SelectStore from "@/app/admin/components/select-store";
import StoreMini from "@/components/store-mini";

type FormType = "fullAddress" | "rawAddress" | "onlineAddress";

export type AddStoreClientProps = {
  storeId?: number;
};

export default function AddAdminBranchClient({ storeId }: AddStoreClientProps) {
  const router = useRouter();
  const [
    createBranchWithFullAddress,
    { loading: creatingBranchWithFullAddress },
  ] = useMutation(CreateBranchFromFullAddressDocument);
  const [createBranch, { loading: creatingBranch }] =
    useMutation(CreateBranchDocument);
  const [findStore, { data: selectedStore }] = useLazyQuery(FindStoreDocument);

  useEffect(() => {
    if (!storeId) return;

    findStore({ variables: { storeId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);
  const [formType, setFormType] = useState<FormType>("fullAddress");
  const loading = creatingBranchWithFullAddress || creatingBranch;

  if (!storeId || !selectedStore) {
    return <div className="flex flex-col flex-1 justify-center">
      <SelectStore onSelectStore={(store) => router.push(`/admin/stores/branch/new?storeId=${store.id}`)} />
    </div>
  }

  return (
    <div className="flex-1">
      <Formik
        initialValues={{} as CreateBranch}
        onSubmit={(values) => {
          if (!storeId) return;

          switch (formType) {
            case "fullAddress":
              createBranchWithFullAddress({
                variables: {
                  storeId,
                  fullAddress: values.name,
                },
              });
              break;
            case "rawAddress":
              createBranch({
                variables: {
                  input: {
                    ...values,
                    storeId,
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
              <StoreMini store={selectedStore.findStore} />
            </div>

            <NativeSelect
              value={formType}
              onChange={(e) => {
                const val = e.target.value as FormType;
                setFormType(val);
              }}
              className="w-full"
            >
              <NativeSelectOption value="fullAddress">Full Address</NativeSelectOption>
              <NativeSelectOption value="rawAddress">Raw Address</NativeSelectOption>
              <NativeSelectOption value="onlineAddress">Online Address</NativeSelectOption>
            </NativeSelect>

            {formType === "fullAddress" && (
              <>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fullAddress">Full Address</FieldLabel>

                    <InputGroup>
                      <InputGroupInput
                        id="fullAddress"
                        placeholder="https://www.walmart.com/"
                        value={formik.values.name}
                        onChange={(v) =>
                          formik.setFieldValue("name", v.target.value)
                        }
                        required
                      />
                    </InputGroup>
                  </Field>
                </FieldGroup>
              </>
            )}
            {formType === "rawAddress" && <></>}
            {formType === "onlineAddress" && <></>}

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
            </Field>
          </form>
        )}
      </Formik>
    </div>
  );
}
