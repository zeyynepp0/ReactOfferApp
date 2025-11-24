import {
  cloneElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import MenuPopover from "./MenuPopover";

export type DropdownMenu = {
  trigger?: ReactElement<any>;
  menuPosition?: "bottom" | "right" | "top";
  offsets?: {
    x: number;
    y: number;
  };
};

export type Position = {
  top: number;
  left: number;
  width: number;
} | null;

export const getMenuPosition = (
  rect: DOMRect,
  pos: "bottom" | "right" | "top"
) => {
  if (pos === "bottom") {
    const left = rect.left;
    return {
      top: rect.bottom + window.scrollY,
      left,
      width: rect.width,
    };
  }
  if (pos === "right") {
    return {
      top: rect.top,
      left: rect.right,
      width: rect.width,
    };
  }

  const left = rect.left;
  return {
    top: rect.top,
    left,
    width: rect.width,
  };
  return null;
};

const Menu = ({
  menuPosition = "bottom",
  children,
  trigger,
  offsets = {
    x: 0,
    y: 0,
  },
}: PropsWithChildren<DropdownMenu>) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  return (
    <>
      {cloneElement(trigger, {
        ...(trigger?.props ?? {}),
        onClick: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition(getMenuPosition(rect, menuPosition));
          trigger?.props.onClick?.(e);
        },
      })}
      {position && (
        <MenuPopover
          position={position}
          offsets={offsets}
          onClose={() => setPosition(null)}
          children={children}
        />
      )}
    </>
  );
};

export default Menu;
