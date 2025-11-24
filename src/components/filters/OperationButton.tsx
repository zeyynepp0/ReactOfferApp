import { useMemo } from "react";
import type { FilterOperations, OperationOption } from "../../types/filterTypes";
import type { FilterType } from "../../types/tableTypes";
import { FILTER_OPERATIONS_MAP } from "../../constants/filterConstants";
import Menu, { type MenuItem } from "../menu/Menu";
import { FiArrowDown} from "react-icons/fi";
interface OperationButtonProps {
  filterType: FilterType;
  value: FilterOperations;
  onChange: (value: FilterOperations) => void;
}

const OperationButton = ({ filterType, value, onChange }: OperationButtonProps) => {
  const options = FILTER_OPERATIONS_MAP[filterType] ?? [];
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "Seçim yapın...";

  const toMenuItems = useMemo(() => {
    const buildEntries = (
      items: OperationOption[],
      parentId: string
    ): MenuItem[] =>
      items.map((option, index) => {
        const entryId = `${parentId}-${option.value}-${index}`;
        const hasChildren = Boolean(option.children?.length);

        return {
          id: entryId,
          label: option.label,
          description: option.description,
          items: hasChildren ? buildEntries(option.children!, entryId) : undefined,
          onSelect: hasChildren ? undefined : () => onChange(option.value),
        };
      });

    return buildEntries(options, filterType);
  }, [filterType, options, onChange]);

  const trigger = (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span className="truncate">{selectedLabel}</span>
      <svg
        className="ml-2 h-4 w-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {/* <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /> */}
       <FiArrowDown className="text-gray-600" />
      </svg>
    </button>
  );

  const menuItems =
    toMenuItems.length > 0
      ? toMenuItems
      : [
          {
            id: `${filterType}-empty`,
            label: "Seçenek yok",
            onSelect: () => undefined,
          },
        ];

  return (
    <div className="w-full" onClick={(event) => event.stopPropagation()}>
      <Menu trigger={trigger} items={menuItems} />
    </div>
  );
};

export default OperationButton;