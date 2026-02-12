import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ReactNode } from "react";
import { FaAngleRight } from "react-icons/fa6";
import Link from "@/components/ui/link";

export type AdminListItemProps = {
  href: string;
  title: string;
  content: string;
  icon: ReactNode;
};

export default function AdminListItem({ title, content, icon, href }: AdminListItemProps) {
  return (
    <Item variant="outline" size="sm" asChild>
      <Link href={href}>
        <ItemMedia>
          <div className="text-xl">{icon}</div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{content}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <FaAngleRight className="size-4" />
        </ItemActions>
      </Link>
    </Item>
  );
}
