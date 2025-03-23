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
  return;
}
export async function updateUser(
  id: number,
  update: Partial<User>
): Promise<any> {
  const response = await api.patch(`/api/users/${id}`, update);
  return response.data;
}
