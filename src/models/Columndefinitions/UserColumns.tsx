import { EditableCell } from "@/components/ui/EditableCell";
import { ColumnDef } from "@tanstack/react-table";
import { assignMandate, unassignMandate, updateUser } from "@/api/userApi";
import { User } from "@/models/User";
import Select from 'react-select'
import { Mandate } from "@/models/Mandate";
import MultiselectTooltip from "@/components/ui/MultiselectTooltip";
import Multiselect from "@/components/Multiselect";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import MandateDialog from "@/components/MandateDialog";
export const usercolumns = (
    updateUserState: (id: number, updatedFields: Partial<User>) => void,
    handleSaveNewUser: (newUser: User) => void,
    handleCancelNewUser: (id: number) => void,
    handlePatchUser: (id: number, user: Partial<User>) => void,
    mandates: Mandate[]
): ColumnDef<User & { isNew?: boolean }>[] => [
        {
            accessorKey: "Id",
            header: "ID",
            cell: (row) => {
                const user = row.row.original;
                return <MandateDialog row={row} mandates={mandates} user={user} updateUserState={updateUserState} assignMandate={assignMandate} unassignMandate={unassignMandate} />
            },
        },
        {
            accessorKey: "FirstName",
            header: "First Name",

            cell: (row) => {
                const user = row.row.original;

                return (
                    <EditableCell
                        key={`_EditableCell_FirstName`}
                        type="text"
                        value={row.getValue() as string}
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
                            handlePatchUser(user.Id, { LastName: String(value) })

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
                            handlePatchUser(user.Id, { Email: String(value) })

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
                            handlePatchUser(user.Id, { KeyUser: Boolean(value) })

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
            cell: (row) => {
                const user = row.row.original;
                return <Multiselect row={row} mandates={mandates} user={user} updateUserState={updateUserState} assignMandate={assignMandate} unassignMandate={unassignMandate}
                // key={`${user.Id}_${user.Mandates.length}`}
                />

            }
        }
    ];
