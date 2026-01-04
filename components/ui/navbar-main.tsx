import Link from "next/link";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useAuth } from "@/context/user-context";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { IoIosSearch } from "react-icons/io";
import { useNavbar } from "@/context/navbar-context";
import { Button } from "./button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  KeyboardEvent,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { IoArrowBack } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import SearchResultsPanel from "../search-results-panel";
import { cn } from "@/lib/utils";
import { BsUpcScan } from "react-icons/bs";
import { MobileView } from "react-device-detect";
import { useSearchContext } from "@/context/search-context";

export default function NavbarMain() {
  const router = useRouter();
  const { loggedIn, user } = useAuth();
  const {
    navbarHeight,
    pageIndicator,
    hideLogotype,
    navTools,
    subHeader,
    subHeaderHeight,
    searchPlaceholder,
    searchQueryPath,
  } = useNavbar();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const querySearchParam = searchParams.get("query");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  const fullNavHeight = useMemo(
    () => navbarHeight + (subHeader && !searchPanelOpen ? subHeaderHeight : 0),
    [subHeader, searchPanelOpen]
  );
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  const onSubmitSearch = useCallback(
    (value: string, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setSearchPanelOpen(false);
        return;
      }
      if (e.key === "Enter") {
        setSearchPanelOpen(false);
        router.push(`${searchQueryPath}?query=${encodeURIComponent(value)}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQueryPath]
  );

  useEffect(() => {
    if (searchPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [searchPanelOpen]);

  return (
    <>
      <header
        className="w-full z-50 fixed top-0 left-0 bg-white shadow-sm"
        style={{ minHeight: navbarHeight }}
      >
        <div
          className="w-full lg:container mx-auto flex items-center justify-between gap-2 md:gap-5"
          style={{ height: navbarHeight }}
        >
          <div
            className={cn(
              "flex flex-row gap-6 items-center justify-start flex-1 w-full pl-5 pr-0 sm:pr-5",
              (searchPanelOpen || navTools) ? "max-w-full" : "max-w-4xl"
            )}
          >
            <div className="page-indicator flex flex-row items-center justify-start">
              <Link
                href="/home"
                className="min-h-[35px] min-w-[35px] flex flex-row items-center justify-center"
              >
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
                      className="h-[23px] hidden 3xs:block w-auto color-white"
                      priority
                    />

                    <Image
                      src="/logo_black_color_dark_leaf.svg"
                      alt="Pricetra"
                      width={210}
                      height={40}
                      className="h-[23px] block 3xs:hidden w-auto color-white"
                      priority
                    />
                  </>
                )}
              </Link>

              {pageIndicator && (
                <div className="flex flex-1 flex-row items-center ml-3 sm:mr-3 mr-0 pl-3 gap-2 justify-start border-l border-gray-200 min-h-[35px]">
                  {pageIndicator}
                </div>
              )}
            </div>

            <div className="search-bar md:relative md:flex-1">
              {/* Non-mobile search input */}
              {!isMobile && (
                <InputGroup
                  onClick={() => {
                    setSearchPanelOpen(true);
                  }}
                  className="rounded-md bg-gray-100 px-0 sm:px-2 py-3 border-transparent text-xs sm:text-sm shadow-none"
                >
                  <InputGroupAddon>
                    <IoIosSearch className="size-[17px] sm:size-5" />
                  </InputGroupAddon>

                  <DesktopSearchbar
                    placeholder={searchPlaceholder}
                    value={querySearchParam ?? undefined}
                    onKeyDown={onSubmitSearch}
                  />
                </InputGroup>
              )}

              {/* Search panel results */}
              {searchPanelOpen && (
                <div
                  className="z-1 absolute left-0 w-full md:py-1"
                  style={{
                    top: fullNavHeight,
                  }}
                >
                  <div
                    className="overflow-y-scroll w-full h-full bg-white md:rounded-lg border-t border-gray-200 md:border-none md:shadow-lg py-5"
                    style={{
                      maxHeight: `calc(95vh - ${
                        isMobile ? "0px" : `${fullNavHeight}px`
                      })`,
                    }}
                  >
                    <SearchResultsPanel
                      onClickResult={() => {
                        setSearchPanelOpen(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navbar tools */}
            {navTools && !searchPanelOpen && (
              <div className="flex flex-row gap-1 items-center justify-end flex-1 md:flex-0">
                {navTools}
              </div>
            )}
          </div>

          <div className="right pr-5 flex gap-2 items-center flex-nowrap">
            {isMobile && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSearchPanelOpen(true);
                }}
                variant="ghost"
                className="p-2"
              >
                <IoIosSearch className="size-[20px]" />
              </Button>
            )}

            {!loggedIn || !user ? (
              <>
                <Link
                  href={`/auth/login?return=${pathname}`}
                  className="text-white bg-pricetra-green-heavy-dark hover:bg-pricetra-green-heavy-dark-hover sm:text-pricetra-green-heavy-dark sm:hover:text-pricetra-green-heavy-dark sm:bg-white sm:hover:bg-pricetra-green-logo/10 md:px-4 font-bold rounded-lg py-1.5 md:py-2 px-4 sm:px-5 text-xs md:text-sm"
                >
                  Login
                </Link>
                <Link
                  href={`/auth/signup?return=${pathname}`}
                  className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white md:px-6 rounded-lg shadow-sm hover:shadow-md transition-all font-bold hidden sm:block py-1.5 md:py-2 px-5 text-xs md:text-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                href="/auth/logout"
                className="flex flex-row items-center gap-2"
              >
                <Image
                  src={createCloudinaryUrl(
                    user.avatar ?? "f89a1553-b74e-426c-a82a-359787168a53",
                    100,
                    100
                  )}
                  alt="Avatar"
                  className="rounded-full size-7"
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
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search input */}
        {searchPanelOpen && isMobile && (
          <div
            className="absolute top-0 left-0 bg-white w-full"
            style={{ height: navbarHeight }}
          >
            <div
              className="w-full lg:container mx-auto flex items-center justify-between gap-3 px-5"
              style={{ height: navbarHeight }}
            >
              <Button
                onClick={() => setSearchPanelOpen(false)}
                variant="ghost"
                className="p-2 -ml-2"
              >
                <IoArrowBack className="size-[20px]" />
              </Button>

              <div className="flex-1">
                <MobileSearchbar
                  placeholder={searchPlaceholder}
                  value={querySearchParam ?? undefined}
                  onKeyDown={onSubmitSearch}
                />
              </div>

              <MobileView>
                <Button
                  onClick={() => router.push("/scan")}
                  variant="secondary"
                  size="icon"
                  rounded
                >
                  <BsUpcScan />
                </Button>
              </MobileView>
            </div>
          </div>
        )}

        {/* Search overlay */}
        {searchPanelOpen && (
          <div
            className="absolute left-0 w-full h-screen bg-white md:bg-black/30"
            style={{ top: fullNavHeight }}
            onClick={() => setSearchPanelOpen(false)}
          />
        )}

        {subHeader && !searchPanelOpen && (
          <div
            className="w-full lg:container mx-auto"
            style={{ height: subHeaderHeight }}
          >
            <div className="flex items-center justify-evenly xs:justify-end gap-2 w-full h-full">
              {subHeader}
            </div>
          </div>
        )}
      </header>

      <div style={{ height: fullNavHeight }}></div>
    </>
  );
}

type SearchbarProps = {
  placeholder: string;
  value?: string;
  onKeyDown: (value: string, e: KeyboardEvent<HTMLInputElement>) => void;
};

function DesktopSearchbar({ placeholder, value, onKeyDown }: SearchbarProps) {
  const { searchText, setSearchText } = useSearchContext();

  useEffect(() => {
    setSearchText(value);
  }, [setSearchText, value]);

  return (
    <InputGroupInput
      placeholder={placeholder}
      className="text-xs sm:text-sm pl-1 sm:pl-2 fade-mask-placeholder"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => onKeyDown(searchText ?? "", e)}
    />
  );
}

function MobileSearchbar({ placeholder, value, onKeyDown }: SearchbarProps) {
  const { searchText, setSearchText } = useSearchContext();

  useEffect(() => {
    setSearchText(value);
  }, [setSearchText, value]);

  return (
    <input
      autoFocus
      placeholder={placeholder}
      className="block w-full outline-none py-3 fade-mask-placeholder"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => onKeyDown(searchText ?? "", e)}
    />
  );
}
