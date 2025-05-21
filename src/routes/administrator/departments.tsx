import { Department } from '@/models/entities/Department';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getDepartments, createDepartment, updateDepartment } from '@/api/departmentApi';
import { DataTable } from '@/components/Datatable';
import { AdminDepartmentColumns } from '@/models/Columndefinitions/AdminDepartmentColumns';
import GenericErrorSetter from '@/utils/GenericErrorSetter';
import GenericCancelAdd from '@/utils/GenericCancelAdd';
import GenericAdd from '@/utils/GenericAdd';
import GenericStateUpdater from '@/utils/GenericStateUpdater';
import { Departmentvalidation } from '@/models/Validationrules/Departmentvalidation';
export const Route = createFileRoute('/administrator/departments')({
    component: RouteComponent,
});

function RouteComponent() {
    type EditableDepartment = Department & { isNew?: boolean };

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
        // setDepartments((prevDepartments) =>
        //     prevDepartments.map((department) =>
        //         department.Id === id ? { ...department, ...updatedFields } : department
        //     )
        // );
        GenericStateUpdater({ setState: setDepartments, id, updatedFields })
    };

    const handleAddDepartment = () => {
        setIsAdding(true);
        setDepartments((prevDepartments) => [
            ...prevDepartments,
            {
                Id: 0,
                Description: '',
                DepartmentCode: '',
                isNew: true, // Flag to indicate this is a new row
            },
        ]);
    };

    const handleSaveNewDepartment = async (newDepartment: Department & { isNew?: boolean }) => {
        try {
            const sanitizedDepartment: EditableDepartment = { ...newDepartment };
            console.log(sanitizedDepartment, newDepartment)
            GenericAdd(Departmentvalidation, sanitizedDepartment)
            const createdDepartment = await createDepartment(newDepartment);
            setDepartments((prevDepartments) =>
                prevDepartments.map((department) =>
                    department.Id === 0 ? createdDepartment : department
                )
            );
            setIsAdding(false);
        }
        catch (error) {

            GenericErrorSetter({ error, setErrors })
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
            GenericErrorSetter({ error, setErrors })
        }
    };

    const handleCancelNewDepartment = (id: number) => {
        GenericCancelAdd(id, setDepartments, setIsAdding)
    };

    return (
        <>
            <button
                onClick={handleAddDepartment}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                disabled={isAdding}
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
            {
                errors?.map(({ errormessage, id }) => (
                    <p key={id} style={{ color: "red " }}>
                        {errormessage}
                    </p>
                ))}
        </>
    );
}
