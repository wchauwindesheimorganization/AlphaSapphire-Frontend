import { api } from "../Api";
export async function getActivitiesForProject(id: number): Promise<any> {
    const response = await api.get(`/api/projects/${id}/activities`);
    return response.data;
}
export async function getActivityById({ projectid, activityid }: { projectid: number, activityid: number }): Promise<any> {
    const response = await api.get(`/api/projects/${projectid}/activities/${activityid}`);
    return response.data;
}