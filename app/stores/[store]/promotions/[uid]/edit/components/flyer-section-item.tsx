import { Product, StorefrontFlyerItem } from "graphql-utils";
import ItemProductHorizontal from "./item-product-horizontal";

export type FlyerSectionItemProps = {
  item: StorefrontFlyerItem;
  type: "horizontal" | "vertical" | "custom";
};

export default function FlyerSectionItem({ item, type }: FlyerSectionItemProps) {
  return <div>
    {type === 'horizontal' && <ItemProductHorizontal product={item.product as Product} />}
  </div>
}
