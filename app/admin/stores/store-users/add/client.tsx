"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { Formik, FormikHelpers, FormikErrors } from "formik";
import {
  AllBranchesDocument,
  AllStoresDocument,
  CreateStoreUserAdmin,
  CreateStoreUserAdminDocument,
  StoreUserRole,
} from "graphql-utils";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { CgSpinner } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { MdEmail } from "react-icons/md";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddStoreUserClient() {
  const [searchStoreValue, setSearchStoreValue] = useState("");
  const [getAllStores, { data: storesData, loading: storesLoading }] =
    useLazyQuery(AllStoresDocument);
  const [
    getAllStoreBranches,
    { data: storeBranchesData, loading: storeBranchesLoading },
  ] = useLazyQuery(AllBranchesDocument);
  const [
    createStoreUser,
    { loading: creatingStoreUser, error: createStoreError },
  ] = useMutation(CreateStoreUserAdminDocument);

  useEffect(() => {
    getAllStores({
      variables: {
        search: searchStoreValue,
        paginator: {
          limit: 11,
          page: 1,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStoreValue]);

  return (
    <>
      <div className="px-5 w-full max-w-[1000px]">
        <h1 className="text-xl font-bold">Create Store User</h1>

        <div className="mt-10">
          <Formik
            initialValues={{} as CreateStoreUserAdmin}
            validateOnMount
            validateOnChange
            validate={(v) => {
              const errors: FormikErrors<CreateStoreUserAdmin> = {};
              if (v.storeId === undefined)
                errors.storeId = "store must be selected";
              if (v.email === undefined || v.email.length === 0)
                errors.email = "email is invalid";
              if (v.role === undefined)
                errors.role = "role needs to be selected";
              if (v.firstName === undefined)
                errors.firstName = "First name must be defined";
              if (v.lastName === undefined)
                errors.lastName = "Last name must be defined";
              return errors;
            }}
            onSubmit={async (
              input: CreateStoreUserAdmin,
              formikHelpers: FormikHelpers<CreateStoreUserAdmin>
            ) => {
              const { data, error } = await createStoreUser({
                variables: {
                  input,
                },
              });
              if (error || !data) return;

              formikHelpers.resetForm();
              setSearchStoreValue("");
              toast.success("Store user was created successfully!");
            }}
          >
            {(formik) => (
              <div className="flex flex-col gap-5">
                <div>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Search Store"
                      value={searchStoreValue}
                      onChange={(v) => setSearchStoreValue(v.target.value)}
                    />
                    <InputGroupAddon>
                      {!storesLoading ? (
                        <IoIosSearch />
                      ) : (
                        <CgSpinner className="animate-spin" />
                      )}
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      {storesData?.allStores.paginator?.total}
                    </InputGroupAddon>
                  </InputGroup>

                  <h4 className="mt-3 font-bold">Select store</h4>
                  <div className="mt-3 flex flex-row flex-wrap gap-3 items-center">
                    {storesData &&
                      storesData.allStores.stores.map((store) => (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            formik.setFieldValue("storeId", store.id);
                            getAllStoreBranches({
                              variables: {
                                storeId: store.id,
                                paginator: {
                                  page: 1,
                                  limit: 50,
                                },
                              },
                            });
                          }}
                          key={store.id}
                        >
                          <div
                            onClick={() => {
                              formik.setFieldValue("storeId", store.id);
                            }}
                            className={cn(
                              "flex flex-col items-center gap-2 cursor-pointer p-2 rounded-sm",
                              store.id === formik.values.storeId
                                ? "bg-gray-100"
                                : "bg-white"
                            )}
                          >
                            <Image
                              src={createCloudinaryUrl(store.logo, 300, 300)}
                              className="size-10 rounded-md"
                              alt={store.logo}
                              width={300}
                              height={300}
                            />
                            <h3 className="text-xs max-w-14 sm:max-w-20 truncate">
                              {store.name}
                            </h3>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {formik.values.storeId &&
                  storeBranchesData &&
                  !storeBranchesLoading && (
                    <div>
                      <NativeSelect
                        value={formik.values.branchId?.toString() ?? undefined}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "branchId",
                            parseInt(e.target.value)
                          );
                        }}
                      >
                        <NativeSelectOption value={undefined}>All Branches (Super user)</NativeSelectOption>
                        {storeBranchesData.allBranches.branches.map(
                          (branch) => (
                            <NativeSelectOption
                              key={branch.id}
                              value={branch.id}
                            >
                              {branch.name}
                            </NativeSelectOption>
                          )
                        )}
                      </NativeSelect>
                    </div>
                  )}

                <div className="flex flex-row gap-3">
                  <InputGroup className="flex-2">
                    <InputGroupInput
                      placeholder="Email"
                      value={formik.values.email ?? ""}
                      onChange={(v) =>
                        formik.setFieldValue("email", v.target.value)
                      }
                      type="email"
                    />
                    <InputGroupAddon>
                      <MdEmail />
                    </InputGroupAddon>
                  </InputGroup>

                  <div className="flex-1">
                    <NativeSelect
                      value={formik.values.role ?? ""}
                      onChange={(e) => {
                        formik.setFieldValue("role", e.target.value.toString());
                      }}
                    >
                      <NativeSelectOption value="">
                        Select Role
                      </NativeSelectOption>
                      {Object.values(StoreUserRole).map((role) => (
                        <NativeSelectOption key={role} value={role.toString()}>
                          {role.toString()}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                </div>

                <div className="flex flex-row gap-3">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="First name"
                      value={formik.values.firstName ?? ""}
                      onChange={(v) =>
                        formik.setFieldValue("firstName", v.target.value)
                      }
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputGroupInput
                      placeholder="Last name"
                      value={formik.values.lastName ?? ""}
                      onChange={(v) =>
                        formik.setFieldValue("lastName", v.target.value)
                      }
                    />
                  </InputGroup>
                </div>

                <InputGroup>
                  <InputGroupInput
                    placeholder="Employee ID (optional)"
                    value={formik.values.employeeId ?? ""}
                    onChange={(v) =>
                      formik.setFieldValue("employeeId", v.target.value)
                    }
                  />
                </InputGroup>

                {createStoreError && (
                  <p className="text-red-700">
                    {createStoreError.name}: {createStoreError.message}
                  </p>
                )}

                {formik.errors && (
                  <ul>
                    {Object.entries(formik.errors).map(([key, val], i) => (
                      <li className="text-red-700" key={`error-${key}-${i}`}>
                        {key}: {val}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-row-reverse">
                  <Button
                    onClick={() => formik.handleSubmit()}
                    variant="pricetra"
                    disabled={creatingStoreUser || !formik.isValid}
                  >
                    {creatingStoreUser && (
                      <CgSpinner className="animate-spin" />
                    )}
                    Create Store User
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
