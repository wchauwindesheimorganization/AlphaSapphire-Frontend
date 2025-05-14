import { api } from "@/Api";
export async function getSubprojectsBySubprojectId({ projectid, subprojectid }: { projectid: number, subprojectid: number }): Promise<any> {
    const response = await api.get(`/api/projects/${projectid}/subprojects/${subprojectid}`);
    return response.data;
}
