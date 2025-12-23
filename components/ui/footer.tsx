import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaXTwitter,
  FaGooglePlay,
  FaInstagram,
  FaLinkedin,
  FaApple,
} from "react-icons/fa6";


export type PartialCategory = { id?: string; name: string };

const categories: PartialCategory[] = [
  { id: '464', name: 'Milk' },
  { id: '478', name: 'Eggs' },
  { id: '509', name: 'Produce' },
  { id: '490', name: 'Bread' },
  { id: '635', name: 'Pasta' },
  { id: '965', name: 'Rice' },
  { id: '474', name: 'Butter' },
];

export const FOOTER_MIN_HEIGHT = 100;

export default function Footer() {
  return (
    <>
      <div className="h-[10vh]" />

      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12">
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
                <a href="https://www.facebook.com/pricetra" target="_blank" title="Facebook">
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
                  <Link
                    href="https://itunes.apple.com/us/app/cooklist/id6746687630"
                    className="rounded-lg px-4 py-2 text-sm bg-gray-800 hover:bg-black text-white flex flex-row items-center justify-center gap-2"
                  >
                    <FaApple />
                    iOS
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.pricetra.mobileApp"
                    className="rounded-lg px-4 py-2 text-sm bg-gray-800 hover:bg-black text-white flex flex-row items-center justify-center gap-2"
                  >
                    <FaGooglePlay />
                    Android
                </Link>
                </div>
              </div>
            </div>

            {/* Section 2: Navigation */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-10">
              <div>
                <h4 className="text-sm font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">
                    <Link href="/home">Browse</Link>
                  </li>
                  <li className="hover:text-gray-900 cursor-pointer">
                    <Link href="/search">Search</Link>
                  </li>
                  <li className="hover:text-gray-900 cursor-pointer">
                    <Link href="/stores">Stores</Link>
                  </li>
                  <li className="hover:text-gray-900 cursor-pointer">
                    <Link href="/business">Business</Link>
                  </li>
                  <li className="hover:text-gray-900 cursor-pointer">
                    <Link href="mailto:hello@pricetra.com">Contact Us</Link>
                  </li>
                </ul>
              </div>

              {/* Section 3: Categories */}
              <div>
                <h4 className="text-sm font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {categories.map(({id, name}) => (
                    <li className="hover:text-gray-900 cursor-pointer" key={id}>
                      <Link href={`/search?categoryId=${id}&category=${encodeURIComponent(name)}`}>
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t flex flex-col 2xs:flex-row items-center justify-between text-sm text-gray-600 gap-5">
            <div>
              <span>© {new Date().getFullYear()} Pricetra.</span>
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
