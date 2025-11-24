import { cloneElement, useMemo, useState, type ReactElement, type ReactNode } from "react";

export type MenuItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  items?: MenuItem[];
};

type MenuProps = {
  trigger: ReactElement<any>;
  items?: MenuItem[];
  content?: ReactNode | ((close: () => void) => ReactNode);
  side?: "left" | "right";
};

const Menu = ({ trigger, items = [], content, side = "right" }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setIsOpen((prev) => !prev);
  };

  const triggerElement = useMemo(
    () =>
      cloneElement(trigger, {
        ...trigger.props,
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          trigger.props?.onClick?.(event);
          toggleMenu(event);
        },
      }),
    [trigger]
  );

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {triggerElement}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu}>
          <div
            className="absolute z-50 rounded-md border border-gray-200 bg-white shadow-lg"
            style={{
              top: position.top,
              left: position.left,
              minWidth: position.width,
              transform: side === "left" ? "translateX(-100%)" : undefined,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {typeof content === "function"
              ? content(closeMenu)
              : content ?? <MenuList items={items} onItemSelect={closeMenu} />}
          </div>
        </div>
      )}
    </>
  );
};

type MenuListProps = {
  items: MenuItem[];
  onItemSelect: () => void;
};

const MenuList = ({ items, onItemSelect }: MenuListProps) => {
  if (!items.length) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">Menü öğesi bulunamadı</div>
    );
  }

  return (
    <ul className="min-w-[200px] divide-y divide-gray-100 text-sm text-gray-800">
      {items.map((item) => (
        <MenuRow key={item.id} item={item} onItemSelect={onItemSelect} />
      ))}
    </ul>
  );
};

type MenuRowProps = {
  item: MenuItem;
  onItemSelect: () => void;
};

const MenuRow = ({ item, onItemSelect }: MenuRowProps) => {
  const isGroup = Boolean(item.items?.length);

  const handleClick = () => {
    if (isGroup) return;
    item.onSelect?.();
    onItemSelect();
  };

  return (
    <li className="relative group">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-2 text-left hover:bg-gray-100"
        onClick={handleClick}
      >
        <span>{item.label}</span>
        {isGroup && <span className="text-xs text-gray-400">›</span>}
      </button>

          {/*alt menü css mantığı ile çalışıyor.  */}
        {isGroup && (
          <div className="relative top-0 left-full hidden min-w-[200px] translate-x-1 rounded-md border border-gray-200 bg-white shadow-lg group-hover:block">
          <MenuList items={item.items ?? []} onItemSelect={onItemSelect} />
        </div>
      )}
    </li>
  );
};

export default Menu;

