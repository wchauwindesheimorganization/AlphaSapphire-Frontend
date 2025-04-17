import { Mandate } from "@/models/Mandate";
import { api } from "../Api";
export async function createMandate(mandate: Mandate) {
    const response = await api.post(`/api/mandates`, mandate);
    return response.data;
}
export async function Mandates(): Promise<any> {
    const response = await api.get(`/api/mandates`);
    return response.data;
}
export async function updateMandate(
    id: number,
    update: Partial<Mandate>
): Promise<any> {
    const response = await api.patch(`/api/mandates/${id}`, update);
    return response.data;
}