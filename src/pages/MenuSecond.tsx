import {
  cloneElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import MenuPopover from "./MenuPopover";
import { getMenuPosition } from "./Menu";

export type DropdownMenu = {
  menuPosition?: "bottom" | "right" | "top";
  offsets?: {
    x: number;
    y: number;
  };
  anchorElement?: any;
  onClose?: () => void;
};

export type Position = {
  top: number;
  left: number;
  width: number;
} | null;

const MenuSecond = ({
  menuPosition = "bottom",
  children,
  anchorElement,
  onClose,
  offsets = {
    x: 0,
    y: 0,
  },
}: PropsWithChildren<DropdownMenu>) => {
  if (!anchorElement) {
    return null;
  }

  return (
      <MenuPopover
        position={
          getMenuPosition(anchorElement.getBoundingClientRect(), menuPosition)!
        }
        offsets={offsets}
        onClose={onClose}
        children={children}
      />
  );
};

export default MenuSecond;
