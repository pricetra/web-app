import Link from "@/components/ui/link";
import { FiChevronRight } from "react-icons/fi";
import { List, ListType } from "graphql-utils";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { MdBookmark } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { capitalize } from "lodash";

export type ModifiedListType = ListType | "history";

export function ListIconRenderer(type: ModifiedListType) {
  switch (type) {
    case ListType.WatchList:
      return <AiFillEye className="text-watch text-lg" />;
    case ListType.Favorites:
      return <AiFillHeart className="text-like" />;
    case "history":
      return <MdHistory className="text-pricetra-green-heavy-dark" />;
    default:
      return <MdBookmark className="text-pricetra-green-heavy-dark" />;
  }
}

export type ListItemProps = {
  type: ModifiedListType;
  list?: List;
};

export default function ListItem({ list, type }: ListItemProps) {
  return (
    <Link
      href={`/profile/lists/${list ? list.id : type}`}
      className="mb-1 flex flex-row items-center justify-between gap-5"
    >
      <div className="flex flex-1 flex-row items-center gap-3 sm:gap-5 px-0 py-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
          {ListIconRenderer(type)}
        </div>
        <div>
          <h5 className="text-base font-bold">
            {list ? list.name : capitalize(type)}
          </h5>
          {list && (
            <div className="text-xs flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{list.productList?.length} Products</span>
              <span>•</span>
              <span>{list.branchList?.length ?? 0} Branches</span>
            </div>
          )}
        </div>
      </div>

      <FiChevronRight className="size-4" />
    </Link>
  );
}
