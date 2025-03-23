import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";

// Define the Payment type
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// EditableCell Component
const EditableCell: React.FC<{
  value: string | number | readonly string[] | undefined;
  onBlur: (value: string | number | readonly string[] | undefined) => void;
}> = ({ value: initialValue, onBlur }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() =>
        onBlur(value as string | number | readonly string[] | undefined)
      }
    />
  );
};

// Columns Array
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => (
      <EditableCell
        value={getValue() as string | number | readonly string[] | undefined}
        onBlur={(value) => console.log("ID updated:", value)}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <EditableCell
        value={getValue() as string | number | readonly string[] | undefined}
        onBlur={(value) => console.log("Status updated:", value)}
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <EditableCell
        value={getValue() as string | number | readonly string[] | undefined}
        onBlur={(value) => console.log("Email updated:", value)}
      />
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <EditableCell
        value={getValue() as string | number | readonly string[] | undefined}
        onBlur={(value) => console.log("Amount updated:", value)}
      />
    ),
  },
];
