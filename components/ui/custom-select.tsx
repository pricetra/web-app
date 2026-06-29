import ReactDropdownSelect, { SelectProps } from "react-dropdown-select";

export default function Select<T extends string | object = object>(
  props: SelectProps<T>,
) {
  return <ReactDropdownSelect {...props} />;
}
