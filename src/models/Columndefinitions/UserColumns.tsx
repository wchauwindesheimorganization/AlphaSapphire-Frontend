import { EditableCell } from "@/components/ui/EditableCell";
import { Row } from "@tanstack/react-table";
import { assignMandate, unassignMandate } from "@/api/userApi";
import { User } from "@/models/entities/User";
import { Mandate } from "@/models/entities/Mandate";
import MandateDialog from "@/components/MandateDialog";
import { Department } from "@/models/entities/Department";
export const usercolumns = ({
    updateUserState,
    handleSaveNewUser,
    handleCancelNewUser,
    handlePatchUser,
    mandates,
}
    : {
        updateUserState: ((id: number, updatedFields: Partial<User & { isNew?: boolean }>) => void),
        handleSaveNewUser: ((newUser: User & { isNew?: boolean }) => void),
        handleCancelNewUser: ((id: number) => void),
        handlePatchUser: ((id: number, user: Partial<User & { isNew?: boolean }>) => void),
        mandates: Mandate[],
    }): any => [
        {
            accessorKey: "Id",
            header: "ID",
            cell: ({ row }: { row: Row<User & { isNew: boolean }> }) => {
                const user = row.original;

                return <MandateDialog row={row} mandates={mandates} user={user} updateUserState={updateUserState} assignMandate={assignMandate} unassignMandate={unassignMandate} />
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
            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
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
            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
                const user = row.original;
                return (
                    <EditableCell
                        type="text"
                        value={getValue() as string}
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
            accessorKey: "Department",
            header: "Department ID",
            cell: ({ getValue }: { getValue: () => {} }) => {

                const userdepartment = getValue() as Department;
                console.log(userdepartment.DepartmentCode)
                return <span>{userdepartment.DepartmentCode}</span>
            },

        },
        {
            accessorKey: "KeyUser",
            header: "Key User",
            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
                const user = row.original;

                return (
                    <EditableCell
                        type="checkbox"
                        checked={user.KeyUser}
                        onChange={(value) => {
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
            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
                const user = row.original;

                if (user.isNew) {
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {

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
            cell: ({ row, getValue }: { row: Row<User & { isNew: boolean }>, getValue: () => string }) => {
                const user = row.original;
                return <span className="w-[12vw] block">{user && user.Mandates && user.Mandates.length > 0 && user.Mandates.map(e => e.MandateName).join(", ")}</span>

            }
        }
    ];
