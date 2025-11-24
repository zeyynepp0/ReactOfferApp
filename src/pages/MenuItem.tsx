import {
  type MouseEventHandler,
  type PropsWithChildren,
  type ReactNode,
} from "react";

type MenuItemProps = {
  selected?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLLIElement>;
};

const MenuItem = ({
  children,
  endIcon,
  selected,
  startIcon,
  onClick,
}: PropsWithChildren<MenuItemProps>) => {
  return (
    <li
      onClick={onClick}
      className={`list-none flex flex-row justify-between gap-3 items-center w-full px-3 py-1 ${
        selected ? "bg-blue-400" : ""
      }`}
    >
      <div className="flex flex-row gap-3 items-center">
        {startIcon}
        {children}
      </div>
      {endIcon}
    </li>
  );
};

export default MenuItem;
