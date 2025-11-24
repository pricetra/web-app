import { memo, ReactElement, ReactNode, useContext, useEffect, useState, useTransition } from "react";
import { ItemId, publicApiType, ScrollMenu, VisibilityContext, } from "react-horizontal-scrolling-menu";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export default function ScrollContainer({
  children,
}: {
  children: ReactElement<{
    itemId: ItemId;
  }>[];
}) {
  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      wrapperClassName="relative py-2.5"
      itemClassName="md:px-2.5 first:pl-5 last:pr-5 md:first:pl-7 md:last:pr-7"
    >
      {children}
    </ScrollMenu>
  );
}

// eslint-disable-next-line react/display-name
const LeftArrow = memo(() => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);

  const [disabled, setDisabled] = useState(isFirstItemVisible);
  useEffect(() => {
    if (visibility.menuVisible.current) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibility.menuVisible]);

  return (
    <Arrow
      disabled={disabled}
      onClick={() => visibility.scrollPrev()}
      className="left-3"
    >
      <LuArrowLeft className="size-[20px]" />
    </Arrow>
  );
});

// eslint-disable-next-line react/display-name
const RightArrow = memo(() => {
  const visibility = useContext<publicApiType>(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", false);

  const [disabled, setDisabled] = useState(isLastItemVisible);
  useEffect(() => {
    if (visibility.menuVisible) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibility.menuVisible]);

  return (
    <Arrow
      disabled={disabled}
      onClick={() => visibility.scrollNext()}
      className="right-3"
    >
      <LuArrowRight className="size-[20px]" />
    </Arrow>
  );
});

const Arrow = ({
  children,
  disabled,
  onClick,
  className,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
  className?: string;
}) => {
  const [, startTransition] = useTransition();

  return (
    <Button
      disabled={disabled}
      onClick={() => startTransition(onClick)}
      className={cn(
        className,
        "rounded-full bg-pricetra-green-heavy-dark color-white absolute z-[2] top-1/2 translate-y-[-50%] shadow-md disabled:opacity-0 text-4xl hidden lg:flex"
      )}
      size="icon"
    >
      {children}
    </Button>
  );
};
