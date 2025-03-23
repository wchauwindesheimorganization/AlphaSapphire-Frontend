import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { updateUser } from "../api/userApi";
export type User = {
  Id: number; // Assuming Id is a numeric identifier
  Email: string; // Email address as a string
  DepartmentId: number; // Department ID, likely numeric
  KeyUser: boolean; // Indicates if the user is a key user
  FirstName: string; // User's first name
  LastName: string; // User's last name
};

const EditableCell: React.FC<{
  value?: string | number | readonly string[] | boolean | undefined;
  onChange?: (
    value?: string | number | readonly string[] | boolean | undefined
  ) => void; // Optional onChange
  onBlur?: (value: string | number | readonly string[] | undefined) => void; // Optional onBlur
  type?: string;
  checked?: boolean;
}> = ({ value: initialValue, onChange, onBlur, type, checked }) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "checkbox") {
      onChange && onChange(e.target.checked); // Use `checked` for checkboxes
    }
  };
  return (
    <input
      type={type || "text"}
      value={String(value) || ""}
      checked={type === "checkbox" ? checked : undefined} // Use `checked` for checkboxes
      onChange={(e) => {
        console.log(e.target.checked);
        setValue(e.target.checked);
        onChange && onChange(e.target.checked);
      }}
      onBlur={() =>
        onBlur &&
        onBlur(value as string | number | readonly string[] | undefined)
      }
      className="border rounded px-2 py-1" // Optional Tailwind classes for styling
    />
  );
};

export const columns = (
  updateUserState: (id: number, updatedFields: Partial<User>) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "Id",
    header: "ID",
    cell: ({ getValue }) => <span>{String(getValue())}</span>,
  },
  {
    accessorKey: "FirstName",
    header: "First Name",
    cell: (row) => {
      const user = row.row.original;
      return (
        <EditableCell
          value={row.getValue() as string}
          onBlur={(value) =>
            updateUser(user.Id, { FirstName: String(value) }).then((data) =>
              console.log(data)
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "LastName",
    header: "Last Name",
    cell: (row) => {
      const user = row.row.original;

      return (
        <EditableCell
          value={row.getValue() as string}
          onBlur={(value) =>
            updateUser(user.Id, { LastName: String(value) }).then((data) =>
              console.log(data)
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: (row) => {
      const user = row.row.original;
      return (
        <EditableCell
          value={row.getValue() as string}
          onBlur={(value) =>
            updateUser(user.Id, { Email: String(value) }).then((data) =>
              console.log(data)
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "DepartmentId",
    header: "Department ID",
    cell: (row) => {
      const user = row.row.original;
      return (
        <EditableCell
          value={row.getValue() as string}
          onBlur={(value) =>
            updateUser(user.Id, { DepartmentId: Number(value) }).then((data) =>
              console.log(data)
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "KeyUser",
    header: "Key User",
    cell: (row) => {
      const user = row.row.original;

      return (
        <EditableCell
          type="checkbox"
          checked={user.KeyUser}
          onChange={(value) => {
            updateUser(user.Id, { KeyUser: Boolean(value) }).then((data) =>
              console.log(data)
            );
            updateUserState(user.Id, { KeyUser: Boolean(value) });
          }}
        />
      );
    },
  },
];
