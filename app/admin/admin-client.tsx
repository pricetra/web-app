"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { useLayoutEffect } from "react";
import { RiAdminLine } from "react-icons/ri";
import { BsPersonFillAdd } from "react-icons/bs";
import { MdStorefront } from "react-icons/md";
import AdminListItem from "./components/admin-list-item";

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
            href="/admin/stores/new"
            icon={<MdStorefront />}
            title="Add New Store"
            content="Create a new store entry"
          />

          <AdminListItem
            href="/admin/stores/store-users/add"
            icon={<BsPersonFillAdd />}
            title="Add Store User"
            content="Send a join request to a new user to an existing store"
          />
        </div>
      </div>
    </>
  );
}
