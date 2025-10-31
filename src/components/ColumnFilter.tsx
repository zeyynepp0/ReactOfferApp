/* import type { ColumnDef } from "../types/tableTypes";
import DateFilter from "./DateFilter";
import TextFilter from "./TextFilter";
import NumberFilter from "./NumberFilter";
import SelectFilter from "./SelectFilter";
import type { ColumnFilterValue } from "./Table";

const ColumnFilter = <T,>({
  column,
  onFilterChange,
}: {
  column?: ColumnDef<T>;
  onFilterChange: (data?: ColumnFilterValue) => void;
}) => {
  const columnType = column?.filterType;

  if (columnType === "date") {
    return (
      <DateFilter
        onValueChange={(val, operationType) => {
          onFilterChange({
            operationType,
            value: val,
          });
        }}
      />
    );
  }

  if (columnType === "number") {
    return <NumberFilter />;
  }
  if (columnType === "select") {
    return <SelectFilter />;
  }
  return <TextFilter />;
};

export default ColumnFilter;
 */