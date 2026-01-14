import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { List, ListType } from "graphql-utils";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { MdBookmark } from "react-icons/md";

function ListIconRenderer(type: ListType) {
  switch (type) {
    case ListType.WatchList:
      return <AiFillEye className="text-watch text-lg" />;
    case ListType.Favorites:
      return <AiFillHeart className="text-like" />;
    default:
      return <MdBookmark className="text-[#396a12]" />;
  }
}

export type ListItemProps = {
  list: List;
};

export default function ListItem({ list }: ListItemProps) {
  return (
    <Link
      href={`/profile/lists/${list.id}`}
      className="mb-1 flex flex-row items-center justify-between gap-5"
    >
      <div className="flex flex-1 flex-row items-center gap-3 sm:gap-5 px-0 py-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
          {ListIconRenderer(list.type)}
        </div>
        <div>
          <h5 className="text-base font-bold">{list.name}</h5>
          <div className="text-xs flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>{list.productList?.length} Products</span>
            <span>•</span>
            <span>{list.branchList?.length ?? 0} Branches</span>
          </div>
        </div>
      </div>

      <FiChevronRight className="size-4" />
    </Link>
  );
}
