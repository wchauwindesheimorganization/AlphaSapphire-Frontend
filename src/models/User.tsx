import { useState } from "react";
import { EditableCell } from "@/components/ui/EditableCell";
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

export const columns = (
  updateUserState: (id: number, updatedFields: Partial<User>) => void,
  handleSaveNewUser: (newUser: User) => void,
  handleCancelNewUser: (id: number) => void
): ColumnDef<User & { isNew?: boolean }>[] => [
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
          type="text"
          value={row.getValue() as string}
          onBlur={(value) => {
            if (user.isNew) {
              updateUserState(user.Id, { FirstName: String(value) });
              return;
            }
            updateUser(user.Id, { FirstName: String(value) })
              .then((data) => {
                console.log(data);
                updateUserState(user.Id, { FirstName: String(value) });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
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
          type="text"
          value={row.getValue() as string}
          onBlur={(value) => {
            if (user.isNew) {
              updateUserState(user.Id, { LastName: String(value) });
              return;
            }
            updateUser(user.Id, { LastName: String(value) })
              .then((data) => {
                console.log(data);
                updateUserState(user.Id, { LastName: String(value) });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
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
          type="text"
          value={row.getValue() as string}
          onBlur={(value) => {
            if (user.isNew) {
              updateUserState(user.Id, { Email: String(value) });
              return;
            }
            updateUser(user.Id, { Email: String(value) })
              .then((data) => {
                console.log(data);
                updateUserState(user.Id, { Email: String(value) });
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      );
    },
  },
  {
    accessorKey: "DepartmentId",
    header: "Department ID",
    cell: ({ getValue }) => <span>{String(getValue())}</span>,

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
            if (user.isNew) {
              updateUserState(user.Id, { KeyUser: Boolean(value) });
              return;
            }
            updateUser(user.Id, { KeyUser: Boolean(value) }).then((data) =>
              console.log(data)
            );
            updateUserState(user.Id, { KeyUser: Boolean(value) });
          }}
        />
      );
    },
  },
  {
    accessorKey: "Actions",
    header: "Actions",
    cell: (row) => {
      const user = row.row.original;

      if (user.isNew) {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log(user);
                console.log(row.row.original);
                handleSaveNewUser(user);
              }}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => handleCancelNewUser(user.Id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        );
      }
      return null; // No actions for existing rows
    },
  },
];
