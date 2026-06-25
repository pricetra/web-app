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
import { AllBusinessFormSignUpsDocument, BusinessForm } from "graphql-utils";
import { SmartPagination } from "@/components/ui/smart-pagination";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { RiAdminLine } from "react-icons/ri";
import { useNavbar } from "@/context/navbar-context";
import BusinessSignUpRow from "./components/business-signup-row";

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

            {businessForms.map((form) => (
              <BusinessSignUpRow key={form.id} form={form as BusinessForm} />
            ))}
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
