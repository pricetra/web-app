"use client";

import { useMutation } from "@apollo/client/react";
import {
  BusinessForm,
  CreateStoreWithBusinessFormDocument,
} from "graphql-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";

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
  }, [businessFormId, createStoreWithBusinessForm]);

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

  return <></>;
}
