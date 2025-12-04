import Link from "next/link";
import Image from "next/image";
import { createCloudinaryUrl } from "@/lib/files";
import { useAuth } from "@/context/user-context";

export default function LandingHeader() {
  const { loggedIn, user } = useAuth();

  return (
    <header className="w-full z-10">
      <div className="max-w-full sm:container mx-auto flex items-center justify-between px-6 md:px-8 py-7 md:py-10 gap-5">
        <Link href="/">
          <Image
            src="/logotype_header_black.svg"
            alt="Pricetra"
            width={210}
            height={40}
            className="h-[23px] sm:h-[30px] block w-auto color-white"
            priority
          />
        </Link>

        {!loggedIn || !user ? (
          <div className="flex items-center gap-3">
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
              Create Account
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

            <div className="flex-1 flex-col hidden max-w-[130px] sm:flex">
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
    </header>
  );
}
