import { api } from "@/Api";
export async function getProjects(): Promise<any> {
    const response = await api.get("/api/projects/");
    return response.data;
}
export async function getProject({ id }: { id: number }): Promise<any> {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
}