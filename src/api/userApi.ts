import { Mandate } from "@/models/entities/Mandate";
import { api } from "../Api";
import { User } from "@/models/entities/User";
export async function getUsers(): Promise<any> {
  const response = await api.get("/api/users/");
  return response.data;
}
export async function getActiveUser(): Promise<any> {
  const response = await api.get("/api/users/me");
  return response.data;
}
export async function createUser(user: User): Promise<any> {
  const response = await api.post(`/api/keyuser/users`, user);
  return response.data;
}
export async function adminCreateUser(user: User): Promise<any> {
  const response = await api.post(`/api/administrator/users`, user);
  return response.data;
}

export async function adminGetUsers(): Promise<any> {
  const response = await api.get("/api/administrator/users/");
  return response.data;
}
export async function updateUser(
  id: number,
  update: Partial<User>
): Promise<any> {
  const response = await api.patch(`/api/keyuser/users/${id}`, update);
  return response.data;
}
export async function adminUpdateUser(
  id: number,
  update: Partial<User>
): Promise<any> {
  const response = await api.patch(`/api/administrator/users/${id}`, update);
  return response.data;
}
export async function assignMandate(id: number, mandates: Mandate[]) {
  const response = await api.post(`/api/keyuser/user/${id}/mandate/assign`, { mandates })
  return response.data
}
export async function unassignMandate(id: number, mandates: Mandate[]) {
  const response = await api.post(`/api/keyuser/user/${id}/mandate/unassign`, { mandates })
  return response.data
}
