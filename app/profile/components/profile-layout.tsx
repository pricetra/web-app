"use client";

import NavPageIndicator from "@/components/ui/nav-page-indicator";
import { useNavbar } from "@/context/navbar-context";
import { useAuth } from "@/context/user-context";
import { ReactNode, useLayoutEffect, useMemo } from "react";
import { FiUser } from "react-icons/fi";
import ProfileFull from "@/components/profile-full";
import { FiPower } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import NavigationItem from "./navigation-item";
import ListItem from "./list-item";
import { usePathname, useRouter } from "next/navigation";
import { isMobileOnly } from "react-device-detect";

export type ProfileLayoutProps = {
  children: ReactNode;
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const { loggedIn, user, lists } = useAuth();
  const { setPageIndicator, resetAll } = useNavbar();

  const showProfilePanel = useMemo(() => {
    if (pathname === "/profile") return true;
    else if (isMobileOnly) return false;
    return true;
  }, [pathname]);

  useLayoutEffect(() => {
    setPageIndicator(
      <NavPageIndicator icon={FiUser} title="My Profile" href="/profile" />
    );

    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loggedIn || !user) {
    return <></>;
  }

  return (
    <div className="relative w-full flex flex-col lg:flex-row gap-10 lg:gap-5 md:mt-5">
      {showProfilePanel && (
        <div className="flex-1 w-full flex flex-col gap-10 px-5">
          <ProfileFull user={user} />

          <div>
            <h4 className="text-xl font-bold">Navigation</h4>

            <div className="mt-5 flex flex-col">
              <NavigationItem
                text="Edit Profile"
                href="/profile/edit/#edit"
                icon={<FaUserEdit />}
              />
              <NavigationItem
                text="Logout"
                href="/auth/logout"
                icon={<FiPower className="text-red-800" />}
              />
            </div>
          </div>

          {lists?.allLists && lists.allLists.length > 0 && (
            <div id="my-lists">
              <h4 className="text-xl font-bold">Lists</h4>

              <div className="mt-5 flex flex-col">
                {lists.allLists.map((list, i) => (
                  <ListItem list={list} key={`list-${list.id}-${i}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-2 px-5">{children}</div>
    </div>
  );
}
