import { Department } from "@/models/entities/Department";
import { Row } from "@tanstack/react-table";
import { EditableCell } from "@/components/ui/EditableCell";
import { ColumnDef } from "@tanstack/react-table";

export const AdminDepartmentColumns = ({
    handleSaveNewDepartment,
    handlePatchDepartment,
    handleCancelNewDepartment,
    updateDepartmentState,
}: {
    handleSaveNewDepartment: (newDepartment: Department & { isNew?: boolean }) => void;
    handlePatchDepartment: (id: number, updatedFields: Partial<Department>) => void;
    handleCancelNewDepartment: (id: number) => void;
    updateDepartmentState: (id: number, updatedFields: Partial<Department>) => void;
}): any => [
        {
            accessorKey: 'Id',
            header: 'ID',
            cell: ({ row }: { row: Row<Department & { isNew: boolean }> }) => <span>{row.original.Id}</span>,
        },
        {
            accessorKey: 'DepartmentCode',
            header: 'Name',
            cell: ({ row }: { row: Row<Department & { isNew: boolean }> }) => {
                const department = row.original;
                return (
                    <EditableCell
                        type="text"
                        value={department.DepartmentCode}
                        onBlur={(value) => {
                            if (department.isNew) {
                                updateDepartmentState(department.Id, { DepartmentCode: String(value) });
                                return;
                            }
                            handlePatchDepartment(department.Id, { DepartmentCode: String(value) });
                        }}
                    />
                );
            },
        },
        {
            header: 'Actions',
            cell: ({ row }: { row: Row<Department & { isNew: boolean }> }) => {
                const department = row.original;
                if (department.isNew) {
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSaveNewDepartment(department)}
                                className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => handleCancelNewDepartment(department.Id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    );
                }
                return null;
            },
        },
    ];