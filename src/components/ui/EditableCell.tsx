import { useState } from "react";
export const EditableCell: React.FC<{
  value?: string | number | readonly string[] | boolean | undefined;
  onChange?: (
    value?: string | number | readonly string[] | boolean | undefined
  ) => void; // Optional onChange
  onBlur?: (value: string | number | readonly string[] | undefined) => void; // Optional onBlur
  type?: string;
  checked?: boolean;
}> = ({ value: initialValue, onChange, onBlur, type, checked }) => {
  const [value, setValue] = useState(initialValue);

  switch (type) {
    case "checkbox":
      return (
        <input
          type={"checkbox"}
          value={String(value) || ""}
          checked={checked} // Use `checked` for checkboxes
          onChange={(e) => {
            setValue(e.target.checked);
            onChange && onChange(e.target.checked);
          }}
          //   className="border rounded px-2 py-1" // Optional Tailwind classes for styling
        />
      );

    case "text":
      return (
        <input
          type={"text"}
          defaultValue={String(value) || ""}
          onBlur={(e) => {
            const newValue = e.target.value;
            if (newValue !== value) {
              setValue(newValue);
              onBlur &&
                onBlur(
                  newValue as string | number | readonly string[] | undefined
                );
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("enter");
              e.currentTarget.blur();
            }
          }}
          //   className="border rounded px-2 py-1" // Optional Tailwind classes for styling
        />
      );
    default:
      break;
  }
};
