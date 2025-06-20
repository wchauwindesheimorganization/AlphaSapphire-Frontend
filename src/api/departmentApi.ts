
import { api } from "../Api";
import { Department } from "@/models/entities/Department";
export async function getDepartments(): Promise<any> {
    const response = await api.get("/api/administrator/departments/");
    return response.data;
}
export async function createDepartment(department: Department): Promise<any> {
    const response = await api.post("/api/administrator/departments", department);
    return response.data;
}
export async function updateDepartment(
    id: number,
    update: Partial<Department>
): Promise<any> {
    const response = await api.patch(
        `/api/administrator/departments/${id}`,
        update
    );
    return response.data;
}