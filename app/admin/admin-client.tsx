"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { useLayoutEffect } from "react";
import { RiAdminLine } from "react-icons/ri";
import { MdStorefront } from "react-icons/md";
import AdminListItem from "./components/admin-list-item";
import { FaEye } from "react-icons/fa";

export default function AdminClient() {
  const { setPageIndicator, resetAll } = useNavbar();

  useLayoutEffect(() => {
    setPageIndicator(<NavPageIndicator icon={RiAdminLine} title="Admin" />);

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full max-w-[1000px] flex-1 px-5">
        <div className="flex flex-col gap-5">
          <AdminListItem
            href="/admin/stores"
            icon={<MdStorefront />}
            title="Manage Stores"
            content="View, edit, and manage stores and their branches"
          />

          <AdminListItem
            href="/admin/products/views"
            icon={<FaEye />}
            title="Product Views"
            content="View product views entries and metrics"
          />
        </div>
      </div>
    </>
  );
}
