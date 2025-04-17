import { EditableCell } from "@/components/ui/EditableCell";
import { ColumnDef } from "@tanstack/react-table";
import { createMandate, updateMandate } from "@/api/mandateApi";
import Select from 'react-select'
import { Mandate } from "@/models/Mandate";
import MultiselectTooltip from "@/components/ui/MultiselectTooltip";
import { Key } from "lucide-react";

export const mandatecolumns = (
    updateMandateState: (id: number, updatedFields: Partial<Mandate>) => void,
    handleSaveNewMandate: (newMandate: Mandate) => void,
    handleCancelNewMandate: (id: number) => void,
    handlePatchMandate: (id: number, mandate: Partial<Mandate>) => void,
    mandates: any
): ColumnDef<Mandate & { isNew?: boolean }>[] => [
        {
            accessorKey: "Id",
            header: "ID",
            cell: ({ getValue }) => <span>{String(getValue())}</span>,
        },
        {
            accessorKey: "MandateName",
            header: "Name",
            cell: (row) => {
                const mandate = row.row.original;
                return (
                    <EditableCell
                        type="text"
                        value={row.getValue() as string}
                        onBlur={(value) => {
                            if (mandate.isNew) {
                                updateMandateState(mandate.Id, { MandateName: String(value) });
                                return;
                            }
                            handlePatchMandate(mandate.Id, { MandateName: String(value) })

                        }}
                    />
                );
            },
        },
        {
            accessorKey: "Description",
            header: "Description",
            cell: (row) => {
                const mandate = row.row.original;

                return (
                    <EditableCell
                        type="textarea"

                        value={row.getValue() as string}
                        onBlur={(value) => {
                            if (mandate.isNew) {
                                updateMandateState(mandate.Id, { Description: String(value) });
                                return;
                            }
                            handlePatchMandate(mandate.Id, { Description: String(value) })

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
            accessorKey: "Actions",
            header: "Actions",
            cell: (row) => {
                const mandate = row.row.original;

                if (mandate.isNew) {
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    handleSaveNewMandate(mandate);
                                }}
                                className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => handleCancelNewMandate(mandate.Id)}
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
