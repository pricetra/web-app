"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import {
  AllBranchesDocument,
  CreateStorefrontFlyerDocument,
  Store,
} from "graphql-utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FlyerFormValues = {
  branchId: string;
  title: string;
  description: string;
  format: string;
  startsAt: string;
  expiresAt: string;
};

const formats = ["A4", "Letter", "Legal"];

export default function CreateStorefrontFlyerForm({ store }: { store: Store }) {
  const router = useRouter();

  const { data: branchesData } = useQuery(AllBranchesDocument, {
    variables: {
      paginator: { page: 1, limit: 50 },
      storeId: store.id,
    },
    fetchPolicy: "cache-and-network",
  });

  const [createFlyer, { loading: creating }] = useMutation(
    CreateStorefrontFlyerDocument,
  );

  const branches = branchesData?.allBranches?.branches || [];

  const initialValues: FlyerFormValues = {
    branchId: "",
    title: "",
    description: "",
    format: "A4",
    startsAt: new Date().toISOString().slice(0, 10),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
  };

  const handleSubmit = async (values: FlyerFormValues) => {
    if (!values.title) {
      toast.error("Please enter a flyer title.");
      return;
    }

    const startsAt = new Date(values.startsAt);
    const expiresAt = new Date(values.expiresAt);
    if (isNaN(startsAt.getTime()) || isNaN(expiresAt.getTime())) {
      toast.error("Please enter valid start and end dates.");
      return;
    }

    if (startsAt > expiresAt) {
      toast.error("The start date must be before the end date.");
      return;
    }

    try {
      const { data } = await createFlyer({
        variables: {
          input: {
            storeId: store.id,
            branchId: values.branchId ? Number(values.branchId) : undefined,
            title: values.title,
            description: values.description || undefined,
            startsAt: startsAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            flyerStyles: JSON.stringify({ format: values.format }),
          },
        },
      });

      if (!data?.createStorefrontFlyer?.uid) {
        throw new Error("Unable to create flyer.");
      }

      toast.success("Flyer created successfully.");
      router.push(
        `/stores/${store.slug}/promotions/${data.createStorefrontFlyer.uid}/edit`,
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <form className="grid gap-5" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-5">
            <FieldGroup className="flex-2">
              <Field>
                <FieldLabel htmlFor="branchId">Branch</FieldLabel>
                <NativeSelect
                  id="branchId"
                  value={formik.values.branchId}
                  onChange={(event) =>
                    formik.setFieldValue("branchId", event.target.value)
                  }
                  className="w-full"
                >
                  <NativeSelectOption value="">
                    Storewide Flyer (no specific branch)
                  </NativeSelectOption>
                  {branches.map((branch) => (
                    <NativeSelectOption
                      key={branch.id}
                      value={branch.id.toString()}
                    >
                      {branch.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>

            <FieldGroup className="flex-1">
              <Field>
                <FieldLabel htmlFor="format">Format</FieldLabel>
                <NativeSelect
                  id="format"
                  value={formik.values.format}
                  onChange={(event) =>
                    formik.setFieldValue("format", event.target.value)
                  }
                  className="w-full"
                >
                  {formats.map((format) => (
                    <NativeSelectOption key={format} value={format}>
                      {format}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Flyer Title</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="title"
                  placeholder="e.g. Weekend Specials"
                  value={formik.values.title}
                  onChange={(event) =>
                    formik.setFieldValue("title", event.target.value)
                  }
                  required
                />
              </InputGroup>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="A short description of this promotion"
                value={formik.values.description}
                onChange={(event) =>
                  formik.setFieldValue("description", event.target.value)
                }
                rows={4}
              />
            </Field>
          </FieldGroup>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="startsAt">Start Date</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="startsAt"
                    type="date"
                    value={formik.values.startsAt}
                    onChange={(event) =>
                      formik.setFieldValue("startsAt", event.target.value)
                    }
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="expiresAt">End Date</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="expiresAt"
                    type="date"
                    value={formik.values.expiresAt}
                    onChange={(event) =>
                      formik.setFieldValue("expiresAt", event.target.value)
                    }
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" variant="pricetra" disabled={creating} onClick={() => formik.handleSubmit()}>
              {creating ? (
                <span className="flex items-center gap-2">
                  <CgSpinner className="animate-spin" /> Creating flyer
                </span>
              ) : (
                "Create Flyer"
              )}
            </Button>
            <p className="text-sm text-gray-500">
              Once created, you will be redirected to the flyer editor.
            </p>
          </div>
        </form>
      )}
    </Formik>
  );
}
