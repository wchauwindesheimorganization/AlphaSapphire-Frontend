import { EditableCell } from "@/components/ui/EditableCell";
import { User } from "@/models/entities/User";
import { Mandate } from "@/models/entities/Mandate";
import DepartmentSelect from "@/components/DepartmentSelect";
import { Department } from "@/models/entities/Department";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
export const adminusercolumns = ({
    updateUserState,
    handleSaveNewUser,
    handleCancelNewUser,
    handlePatchUser,
    mandates,
    departments }
    : {
        updateUserState: ((id: number, updatedFields: Partial<User & { isNew?: boolean }>) => void),
        handleSaveNewUser: ((newUser: User & { isNew?: boolean }) => void),
        handleCancelNewUser: ((id: number) => void),
        handlePatchUser: ((id: number, user: Partial<User & { isNew?: boolean }>) => void),
        mandates: Mandate[],
        departments: Department[]
    }): any => [
        {
            accessorKey: "Id",
            header: "ID",
            cell: ({ row }: { row: Row<User & { isNew: boolean }> }) => {

                const user = row.original;
                return <span>{user!.Id}</span>
            },
        },
        {
            accessorKey: "FirstName",
            header: "First Name",

            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
                const user = row.original;
                return (
                    <EditableCell
                        type="text"
                        value={getValue()}
                        onBlur={(value) => {
                            console.log(user)
                            if (user.isNew) {
                                updateUserState(user.Id, { FirstName: String(value) });
                                return;
                            }
                            handlePatchUser(user.Id, { FirstName: String(value) })

                        }}
                    />
                );
            },
        },
        {
            accessorKey: "LastName",
            header: "Last Name",
            cell: ({ row, getValue }: { row: Row<User & { isNew?: boolean }>, getValue: () => string }) => {
                const user = row.original;

                return (
                    <EditableCell
                        type="text"
                        value={getValue()}
                        onBlur={(value) => {
                            if (user.isNew) {
                                updateUserState(user.Id, { LastName: String(value) });
                                return;
                            }
                            handlePatchUser(user.Id, { LastName: String(value) })

                        }}
                    />
                );
            },
        },
        {
            accessorKey: "Email",
            header: "Email",
            cell: ({ row, getValue }: { row: Row<User & { isNew?: boolean }>, getValue: () => string }) => {
                const user = row.original;
                return (
                    <EditableCell
                        type="text"
                        value={getValue()}
                        onBlur={(value) => {
                            if (user.isNew) {
                                updateUserState(user.Id, { Email: String(value) });
                                return;
                            }
                            handlePatchUser(user.Id, { Email: String(value) })

                        }}
                    />
                );
            },
        },
        {
            accessorKey: "DepartmentId",
            header: "Department Code",
            cell: ({ row }: { row: Row<User & { isNew?: boolean }> }) => {
                const user = row.original;
                return (<DepartmentSelect departments={departments} user={user} updateUser={updateUserState} ></DepartmentSelect>)
            },
        },
        {
            accessorKey: "KeyUser",
            header: "Key User",
            cell: ({ row }: { row: Row<User & { isNew?: boolean }> }) => {
                const user = row.original;

                return (
                    <EditableCell
                        type="checkbox"
                        checked={user.KeyUser}
                        onChange={(value) => {
                            console.log(value)
                            if (user.isNew) {
                                updateUserState(user.Id, { KeyUser: Boolean(value) });
                                return;
                            }
                            handlePatchUser(user.Id, { KeyUser: Boolean(value) })

                        }}
                    />
                );
            },
        },
        {
            accessorKey: "Actions",
            header: "Actions",
            cell: ({ row, getValue }: { row: Row<User & { isNew?: boolean }>, getValue: () => {} }) => {
                const user = row.original;

                if (user.isNew) {
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    console.log(user)
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
        {
            header: "Mandates",
            cell: ({ row }: { row: Row<User & { isNew?: boolean }> }) => {
                const user = row.original;
                return <span className="w-[12vw] block">{user && user.Mandates && user.Mandates.length > 0 && user.Mandates.map(e => e.MandateName).join(", ")}</span>

            }
        }
    ];
