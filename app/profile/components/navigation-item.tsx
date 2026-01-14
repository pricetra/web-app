import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function NavigationItem({
  href,
  text,
  icon,
}: {
  href: string;
  text: string;
  icon: React.ReactElement;
}) {
  return (
    <Link
      href={href}
      className="mb-1 flex flex-row items-center justify-between gap-5">
      <div className="flex flex-1 flex-row items-center gap-3 sm:gap-5 px-0 py-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
        <div>
          <h5 className="text-base sm:text-lg">{text}</h5>
        </div>
      </div>

      <FiChevronRight className="size-4" />
    </Link>
  );
}
