import Link from "next/link";
import { IoIosSearch } from "react-icons/io";

export type SearchResultItemProps = {
  searchTerm: string;
  customSearchQuery?: string;
  handleOnClick: () => void;
};

export default function SearchResultItem({
  searchTerm,
  customSearchQuery,
  handleOnClick,
}: SearchResultItemProps) {
  return (
    <Link
      href={`/search?query=${encodeURIComponent(
        customSearchQuery ?? searchTerm
      )}`}
      className="py-2 px-5 xs:px-4 bg-white hover:bg-gray-100 rounded-none xs:rounded-md"
      onClick={handleOnClick}
    >
      <div className="flex flex-row items-center gap-5">
        <IoIosSearch className="size-4" />
        <span>{searchTerm}</span>
      </div>
    </Link>
  );
}
