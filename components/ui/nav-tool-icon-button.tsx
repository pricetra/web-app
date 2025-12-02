import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export type NavToolIconButtonProps = {
  children?: ReactNode;
  onClick: () => void;
  tooltip?: string;
}

export default function NavToolIconButton({children, onClick, tooltip}: NavToolIconButtonProps) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        className="bg-background p-1.5 m-0 border-0 text-[1.05em] cursor-pointer"
      >
        {children}
      </button>
    </TooltipTrigger>
    {tooltip && (
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    )}
  </Tooltip>;
}
