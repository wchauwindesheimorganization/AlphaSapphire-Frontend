import { Mandate } from "@/models/Mandate";
import { api } from "../Api";
import { User } from "../models/User";
export async function getUsers(): Promise<any> {
  const response = await api.get("/api/users/");
  return response.data;
}
export async function getActiveUser(): Promise<any> {
  const response = await api.get("/api/users/me");
  return response.data;
}
export async function createUser(user: User): Promise<any> {
  const response = await api.post(`/api/users`, user);
  return response.data;
}
export async function Mandates(): Promise<any> {
  const response = await api.get(`/api/mandates`);
  return response.data;
}

export async function updateUser(
  id: number,
  update: Partial<User>
): Promise<any> {
  const response = await api.patch(`/api/users/${id}`, update);
  return response.data;
}
export async function assignMandate(id: number, mandates: Mandate[]) {
  const response = await api.post(`/api/user/${id}/mandate/assign`, { mandates })
  return response.data
}
export async function unassignMandate(id: number, mandates: Mandate[]) {
  const response = await api.post(`/api/user/${id}/mandate/unassign`, { mandates })
  return response.data
}
