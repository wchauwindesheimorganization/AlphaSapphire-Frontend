import { Department } from '@/models/entities/Department';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getDepartments, createDepartment, updateDepartment } from '@/api/departmentApi';
import { DataTable } from '@/components/Datatable';
import { AdminDepartmentColumns } from '@/models/Columndefinitions/AdminDepartmentColumns';

export const Route = createFileRoute('/administrator/departments')({
    component: RouteComponent,
});

function RouteComponent() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [errors, setErrors] = useState<
        { id: number; errormessage: string }[] | null
    >();
    useEffect(() => {
        getDepartments()
            .then((data) => setDepartments(data))
            .catch((error) => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    const updateDepartmentState = (id: number, updatedFields: Partial<Department>) => {
        setDepartments((prevDepartments) =>
            prevDepartments.map((department) =>
                department.Id === id ? { ...department, ...updatedFields } : department
            )
        );
    };

    const handleAddDepartment = () => {
        setIsAdding(true);
        setDepartments((prevDepartments) => [
            ...prevDepartments,
            {
                Id: 0,
                DepartmentName: '',
                Description: '',
                DepartmentCode: '',
                isNew: true, // Flag to indicate this is a new row
            },
        ]);
    };

    const handleSaveNewDepartment = async (newDepartment: Department & { isNew?: boolean }) => {
        try {
            const createdDepartment = await createDepartment(newDepartment);
            setDepartments((prevDepartments) =>
                prevDepartments.map((department) =>
                    department.Id === 0 ? createdDepartment : department
                )
            );
            setIsAdding(false);
        } catch (error) {
            if (error instanceof Error && (error as any).response?.data) {
                const errorsWithId = (error as any).response?.data.map(
                    (errormessage: string, id: number) => ({
                        id: id,
                        errormessage,
                    })
                );
                setErrors(errorsWithId);
            } else {
                console.error("Unexpected error:", error);
                setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
            }
        }
    };

    const handlePatchDepartment = async (id: number, updatedFields: Partial<Department>) => {
        try {
            const updatedDepartment = await updateDepartment(id, updatedFields);
            setDepartments((prevDepartments) =>
                prevDepartments.map((department) =>
                    department.Id === id ? { ...department, ...updatedFields } : department
                )
            );
        } catch (error) {
            if (error instanceof Error && (error as any).response?.data) {
                const errorsWithId = (error as any).response?.data.map(
                    (errormessage: string, id: number) => ({
                        id: id,
                        errormessage,
                    })
                );
                setErrors(errorsWithId);
            } else {
                console.error("Unexpected error:", error);
                setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
            }
        }
    };

    const handleCancelNewDepartment = (id: number) => {
        setDepartments((prevDepartments) =>
            prevDepartments.filter((department) => department.Id !== id)
        );
        setIsAdding(false);
    };

    return (
        <>
            <button
                onClick={handleAddDepartment}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Department
            </button>
            <DataTable
                columns={AdminDepartmentColumns({
                    handleSaveNewDepartment,
                    handlePatchDepartment,
                    handleCancelNewDepartment,
                    updateDepartmentState,
                })}
                data={departments}
            />
            {errors &&
                errors.map(({ errormessage, id }) => (
                    <p key={id} style={{ color: "red " }}>
                        {errormessage}
                    </p>
                ))}
        </>
    );
}
