import Link from "next/link";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useAuth } from "@/context/user-context";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { IoIosSearch } from "react-icons/io";
import { useNavbar } from "@/context/navbar-context";

export const NAVBAR_HEIGHT = 60;

export default function NavbarMain() {
  const { loggedIn, user } = useAuth();
  const { pageIndicator, hideLogotype } = useNavbar();

  return (
    <>
      <header
        className="w-full z-50 fixed top-0 left-0 bg-white shadow-sm"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <div className="container mx-auto flex items-center justify-between gap-5 h-full">
          <div className="flex flex-row gap-6 items-center justify-start flex-1 max-w-2xl w-full px-5">
            <div className="page-indicator flex flex-row gap-3 items-center justify-start">
              <Link href="/" className="block">
                {pageIndicator || hideLogotype ? (
                  <Image
                    src="/logo_black_color_dark_leaf.svg"
                    alt="Pricetra"
                    width={210}
                    height={40}
                    className="h-[23px] block w-auto color-white"
                    priority
                  />
                ) : (
                  <>
                    <Image
                      src="/logotype_header_black.svg"
                      alt="Pricetra"
                      width={210}
                      height={40}
                      className="h-[23px] hidden md:block w-auto color-white"
                      priority
                    />

                    <Image
                      src="/logo_black_color_dark_leaf.svg"
                      alt="Pricetra"
                      width={210}
                      height={40}
                      className="h-[23px] block md:hidden w-auto color-white"
                      priority
                    />
                  </>
                )}
              </Link>

              {pageIndicator && (
                <div className="flex flex-row items-center gap-3 justify-start">
                  {pageIndicator}
                </div>
              )}
            </div>

            <div className="search-bar flex-1">
              <InputGroup className="rounded-md bg-gray-100 px-0 sm:px-2 py-3 border-transparent text-xs sm:text-base">
                <InputGroupInput
                  placeholder="Search..."
                  className="text-sm sm:text-base"
                />
                <InputGroupAddon className="ml-0 mr-1 sm:mr-2">
                  <IoIosSearch className="size-[17px] sm:size-[20px]" />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className="right pr-5">
            {!loggedIn || !user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-pricetra-green-heavy-dark hover:text-pricetra-green-heavy-dark hover:bg-pricetra-green-logo/10 md:px-4 font-bold rounded-lg py-2 px-5 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white md:px-6 rounded-lg shadow-sm hover:shadow-md transition-all font-bold hidden sm:block py-2 px-5 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex gap-2 items-center flex-nowrap">
                <Image
                  src={createCloudinaryUrl(
                    user.avatar ?? "f89a1553-b74e-426c-a82a-359787168a53",
                    100,
                    100
                  )}
                  alt="Avatar"
                  className="rounded-full size-8"
                  width={50}
                  height={50}
                  quality={100}
                />

                <div className="flex-1 flex-col hidden max-w-[130px] lg:flex">
                  <h4 className="font-semibold text-xs line-clamp-1">
                    {user.name}
                  </h4>
                  <h5 className="text-[11px] text-gray-700 line-clamp-1 break-all">
                    {user.email}
                  </h5>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: NAVBAR_HEIGHT }}></div>
    </>
  );
}
