import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginSignupButtons() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row items-center justify-center gap-5">
      <Link
        href={`/auth/login?return=${pathname}`}
        className="bg-gray-800 hover:bg-black text-white md:px-6 rounded-lg shadow-sm hover:shadow-md transition-all font-bold py-2 px-5 text-sm"
      >
        Login
      </Link>
      <Link
        href={`/auth/signup?return=${pathname}`}
        className="bg-pricetra-green-dark hover:bg-pricetra-green-heavy-dark text-white md:px-6 rounded-lg shadow-sm hover:shadow-md transition-all font-bold py-2 px-5 text-sm"
      >
        Create Account
      </Link>
    </div>
  );
}
