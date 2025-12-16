import Link from "next/link";
import { IoIosSearch } from "react-icons/io";

export type SearchResultItemProps = {
  searchTerm: string;
  customSearchQuery?: string;
}

export default function SearchResultItem({ searchTerm, customSearchQuery }: SearchResultItemProps) {
  return (
    <Link
      href={`/search?query=${encodeURIComponent(customSearchQuery ?? searchTerm)}`}
      className="py-1.5"
    >
      <div className="flex flex-row items-center gap-5">
        <IoIosSearch className="size-4" />
        <span>{searchTerm}</span>
      </div>
    </Link>
  );
}
