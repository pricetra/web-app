"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { useLayoutEffect } from "react";
import { RiAdminLine } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6";
import { BsPersonFillAdd } from "react-icons/bs";
import { MdStorefront } from "react-icons/md";
import Link from "next/link";

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
          <Item variant="outline" size="sm" asChild>
            <Link href="/admin/stores/new">
              <ItemMedia>
                <MdStorefront className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Add New Store</ItemTitle>
                <ItemDescription>Create a new store entry</ItemDescription>
              </ItemContent>
              <ItemActions>
                <FaAngleRight className="size-4" />
              </ItemActions>
            </Link>
          </Item>

          <Item variant="outline" size="sm" asChild>
            <Link href="/admin/stores/store-users/add">
              <ItemMedia>
                <BsPersonFillAdd className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Add Store User</ItemTitle>
                <ItemDescription>
                  Send a join request to a new user to an existing store
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <FaAngleRight className="size-4" />
              </ItemActions>
            </Link>
          </Item>
        </div>
      </div>
    </>
  );
}
