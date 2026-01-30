import { APP_STORE, PLAY_STORE } from "@/constants/mobile-app";
import { COMMON_CATEGORIES } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { AppStoreButton, GooglePlayButton } from "./app-store-buttons";

export const FOOTER_MIN_HEIGHT = 100;

export type FooterProps = {
  disableExtraSpacing?: boolean;
};

export default function Footer({ disableExtraSpacing = false }: FooterProps) {
  return (
    <>
      {!disableExtraSpacing && <div className="h-[10vh]" />}

      <footer className="bg-gray-50 border-t">
        <div className="w-full lg:container mx-auto px-5 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Section 1: Logo & Social */}
            <div className="space-y-4">
              <div className="mb-5">
                <div className="mb-2">
                  <Link
                    href="/home"
                    className="opacity-80 hover:opacity-100 inline-block"
                  >
                    <Image
                      src="/logotype_light.svg"
                      className="w-[130px] md:w-[150px] max-w-full"
                      width={100}
                      height={100}
                      priority
                      alt="Pricetra"
                    />
                  </Link>
                </div>
                <p className="text-sm text-gray-600">
                  Your price tracking companion
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/pricetra"
                  target="_blank"
                  title="Facebook"
                >
                  <FaFacebook className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                </a>
                <a href="https://x.com/pricetra_hq" target="_blank" title="X">
                  <FaXTwitter className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                </a>
                <FaInstagram className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <FaLinkedin className="h-5 w-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              </div>

              <div className="mt-7">
                <h4 className="text-sm font-semibold mb-2">Download our App</h4>

                <div className="flex flex-row flex-wrap gap-2">
                  <AppStoreButton size="sm" href={APP_STORE} />
                  <GooglePlayButton size="sm" href={PLAY_STORE} />
                </div>
              </div>
            </div>

            {/* Section 2: Navigation */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-10">
              <div>
                <h4 className="text-sm font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <ListItemWithHover href="/home">Browse</ListItemWithHover>
                  <ListItemWithHover href="/search">Search</ListItemWithHover>
                  <ListItemWithHover href="/stores">Stores</ListItemWithHover>
                  <ListItemWithHover href="/scan">Scan</ListItemWithHover>
                  <ListItemWithHover href="/download">Download</ListItemWithHover>
                  <ListItemWithHover href="/business">
                    Business
                  </ListItemWithHover>
                  <ListItemWithHover href="mailto:hello@pricetra.com">
                    Contact Us
                  </ListItemWithHover>
                </ul>
              </div>

              {/* Section 3: Categories */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {COMMON_CATEGORIES.map(({ id, name }) => (
                    <ListItemWithHover
                      href={`/search?categoryId=${id}&category=${encodeURIComponent(
                        name,
                      )}`}
                      key={id}
                    >
                      {name}
                    </ListItemWithHover>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t flex flex-col 3xs:flex-row items-center justify-between text-xs sm:text-sm text-gray-600 gap-5">
            <div>
              <span>© {new Date().getFullYear()} Pricetra</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-900">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-900">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function ListItemWithHover({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="hover:text-gray-900 cursor-pointer">
        {children}
      </Link>
    </li>
  );
}
