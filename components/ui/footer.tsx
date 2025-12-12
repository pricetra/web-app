import Image from "next/image";
import Link from "next/link";

export const FOOTER_MIN_HEIGHT = 100;

export default function Footer() {
  return (
    <>
      <div className="h-[10vh]" />

      <footer
        className="border-t border-gray-200 bg-gray-50 w-full"
        style={{ minHeight: FOOTER_MIN_HEIGHT }}
      >
        <div className="px-5 pt-10 pb-0 flex flex-row items-center justify-center">
          <Link
            href="/home"
            className="opacity-70 hover:opacity-100 grayscale-100"
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

        <div className="w-full lg:container mx-auto px-5 pt-5 pb-14">
          <div className="flex flex-row"></div>

          <div className="mt-5 flex flex-col 2xs:flex-row justify-between items-center gap-5 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              © {new Date().getFullYear()} Pricetra
            </div>
            <div className="flex items-center gap-4">
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
