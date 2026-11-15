import Link from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { IoIosSearch } from "react-icons/io";

export type SearchResultItemProps = {
  baseUrl?: string;
  searchTerm: string;
  customSearchQuery?: string;
  handleOnClick: () => void;
  isSelected?: boolean;
};

export default function SearchResultItem({
  baseUrl = "/search",
  searchTerm,
  customSearchQuery,
  handleOnClick,
  isSelected,
}: SearchResultItemProps) {
  return (
    <Link
      href={`${baseUrl}?query=${encodeURIComponent(
        customSearchQuery ?? searchTerm
      )}`}
      className={cn(
        "py-2 px-5 xs:px-4 bg-white hover:bg-gray-100 rounded-none xs:rounded-md",
        isSelected && "bg-gray-100"
      )}
      onClick={handleOnClick}
    >
      <div className="flex flex-row items-center gap-5">
        <IoIosSearch className="size-4" />
        <div className="flex-2">
          <span>{searchTerm}</span>
        </div>
      </div>
    </Link>
  );
}
