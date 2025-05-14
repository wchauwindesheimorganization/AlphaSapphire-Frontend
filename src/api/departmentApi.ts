
import { api } from "../Api";
export async function getDepartments(): Promise<any> {
    const response = await api.get("/api/administrator/departments/");
    return response.data;
}