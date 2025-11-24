import ReactDOM from "react-dom";
import type { DropdownMenu, Position } from "./Menu";
import type { PropsWithChildren } from "react";

type MenuPopoverType = Pick<DropdownMenu, "offsets"> & {
  position?: Position;
  onClose?: () => void;
};

const MenuPopover = ({
  offsets = {
    x: 0,
    y: 0,
  },
  position,
  onClose,
  children,
}: PropsWithChildren<MenuPopoverType>) => {
  if (!position) return null;

  return ReactDOM.createPortal(
    <div className="top-0 left-0 h-screen w-screen absolute" onClick={onClose}>
      <div
        style={{
          position: "absolute",
          minWidth: position.width > 200 ? position.width : 200,
          left: position.left + offsets.x,
          top: position.top + offsets.y,
        }}
        className="shadow border border-gray-300 rounded bg-white w-max overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default MenuPopover;
