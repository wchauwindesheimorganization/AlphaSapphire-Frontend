import Select from "node_modules/react-select/dist/declarations/src/Select";
import { useState } from "react";
import { useEffect } from "react";
export const EditableCell: React.FC<{
  value?: string | number | readonly string[] | boolean | undefined;
  onChange?: (
    value?: string | number | readonly string[] | boolean | undefined
  ) => void; // Optional onChange
  onBlur?: (value: string | number | readonly string[] | undefined) => void;
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
        />
      );

    case "text":
      return (
        <input
          className="w-full whitespace-normal break-words overflow-auto rounded p-2 !important"


          type={"text"}
          defaultValue={String(value) || ""}
          onBlur={(e) => {
            const newValue = e.target.value;
            if (newValue !== value) {
              console.log(newValue, value);
              setValue(newValue);
              onBlur &&
                onBlur(
                  newValue as string | number | readonly string[] | undefined
                );
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
        />
      );

    case "textarea":
      return (<textarea
        className="w-full p-2 whitespace-normal rounded resize-none overflow-hidden"
        ref={(textarea) => {
          if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
          }
        }}
        onInput={(e) => {

          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}

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
        }}></textarea>);

    default:
      break;
  }
};
