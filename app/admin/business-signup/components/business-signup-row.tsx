import { TableCell, TableRow } from "@/components/ui/table";
import { useMutation } from "@apollo/client/react";
import { BusinessForm, AllBusinessFormSignUpsDocument, CreateStoreWithBusinessFormDocument } from "graphql-utils";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { createCloudinaryUrl } from "@/lib/files";
import { cn } from "@/lib/utils";

export type BusinessSignUpRowProps = {
  form: BusinessForm;
};

export default function BusinessSignUpRow({ form }: BusinessSignUpRowProps) {
  const [createStoreWithBusinessForm, { loading: creatingBusinessFormStore }] = useMutation(
    CreateStoreWithBusinessFormDocument,
    {
      refetchQueries: [{ query: AllBusinessFormSignUpsDocument }],
      awaitRefetchQueries: true,
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const storeLink = form.store
    ? `/admin/stores/${form.store.slug}`
    : `/admin/stores/new?businessFormId=${form.id}`;

  return (
    <TableRow
      className={cn(
        "hover:bg-gray-50 text-xs",
        form.storeId ? "bg-gray-50" : "bg-white",
      )}
    >
      <TableCell className="font-medium flex flex-row gap-3 font-mono">
        {!form.store && (
          <div className="size-2 bg-pricetra-green-dark rounded-full mt-2" />
        )}
        <div className="flex-1">{form.id}</div>
      </TableCell>
      <TableCell>
        {form.firstName} {form.lastName}
      </TableCell>
      <TableCell className="text-wrap break-all">
        <a href={`mailto:${form.email}`} className="text-blue-500 hover:underline">
          {form.email}
        </a>
      </TableCell>
      <TableCell>{form.phoneNumber ?? "N/A"}</TableCell>
      <TableCell>{form.storeName ?? "N/A"}</TableCell>
      <TableCell>{form.storeAddress ?? "N/A"}</TableCell>
      <TableCell className="text-wrap break-all">
        {form.onlineAddressUrl ?? "N/A"}
      </TableCell>
      <TableCell className="text-wrap break-all">
        {form.storeUrl ?? "N/A"}
      </TableCell>
      <TableCell>
        <Image
          src={createCloudinaryUrl(form.storeLogo, 100, 100)}
          width={80}
          height={80}
          quality={100}
          alt={form.storeLogo}
        />
      </TableCell>
      <TableCell className="max-w-xs truncate">
        {form.additionalInformation ?? "N/A"}
      </TableCell>
      <TableCell>
        {form.store ? (
          <Link
            href={storeLink}
            className="text-pricetra-green-heavy-dark hover:underline"
          >
            {form.store.name}
          </Link>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell className="text-sm">
        {form.store ? (
          <Link
            href={storeLink}
            className="text-pricetra-green-heavy-dark hover:underline font-mono"
          >
            View store
          </Link>
        ) : (
          <Button
            size="xs"
            variant="pricetra"
            onClick={() =>
              createStoreWithBusinessForm({
                variables: { id: form.id },
              })
            }
            disabled={creatingBusinessFormStore}
          >
            {creatingBusinessFormStore ? (
              <CgSpinner className="animate-spin" />
            ) : (
              "Accept"
            )}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
