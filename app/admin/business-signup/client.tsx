"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { AllBusinessFormSignUpsDocument } from "graphql-utils";
import Link from "@/components/ui/link";
import { SmartPagination } from "@/components/ui/smart-pagination";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { cn } from "@/lib/utils";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { RiAdminLine } from "react-icons/ri";
import { useNavbar } from "@/context/navbar-context";

export default function BusinessSignUpClient() {
  const { setPageIndicator, resetAll } = useNavbar();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [getBusinessForms, { data, loading }] = useLazyQuery(
    AllBusinessFormSignUpsDocument,
    {
      fetchPolicy: "no-cache",
    },
  );

  useLayoutEffect(() => {
    setPageIndicator(<NavPageIndicator icon={RiAdminLine} title="Admin" href="/admin" />);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBusinessForms({
      variables: {
        paginator: {
          limit: 50,
          page,
        },
        showCompleted:
          statusFilter === "all" ? undefined : statusFilter === "completed",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const businessForms = data?.allBusinessFormSignUps.businessForms ?? [];
  const paginator = data?.allBusinessFormSignUps.paginator;

  return (
    <div className="w-full flex-1 p-5">
      <div className="flex flex-row items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold">Business Signups</h1>
          <p className="text-sm text-gray-500">
            Review business signup data submitted through the form.
          </p>
        </div>

        <div className="w-full max-w-[220px]">
          <NativeSelect
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value as "all" | "pending" | "completed",
              );
              setPage(1);
            }}
          >
            <NativeSelectOption value="all">All</NativeSelectOption>
            <NativeSelectOption value="pending">Pending</NativeSelectOption>
            <NativeSelectOption value="completed">Completed</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Store Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Online Store</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Additional Info</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {Array(12)
                      .fill(0)
                      .map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full rounded bg-gray-100" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}

            {businessForms.map((form) => {
              const storeLink = form.store
                ? `/admin/stores/${form.store.slug}`
                : `/admin/stores/new?businessFormId=${form.id}`;

              return (
                <TableRow
                  key={form.id}
                  className={cn(
                    "hover:bg-gray-50 text-xs",
                    form.storeId ? "bg-gray-50" : "bg-white",
                  )}
                >
                  <TableCell className="font-medium flex flex-row gap-3">
                    {!form.store && (
                      <div className="size-2 bg-pricetra-green-dark rounded-full mt-2" />
                    )}
                    <div className="flex-1">{form.id}</div>
                  </TableCell>
                  <TableCell>
                    {form.firstName} {form.lastName}
                  </TableCell>
                  <TableCell className="text-wrap break-all">
                    {form.email}
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
                  <TableCell className="font-mono text-sm">
                    <Link
                      href={storeLink}
                      className="text-pricetra-green-heavy-dark hover:underline"
                    >
                      {form.store ? "View store" : "Accept"}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {paginator?.numPages && paginator.numPages > 1 && (
        <div className="mt-10">
          <SmartPagination
            paginator={paginator}
            urlBase="/admin/business-signup"
          />
        </div>
      )}

      {!loading && businessForms.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No business signups found.
        </div>
      )}
    </div>
  );
}
