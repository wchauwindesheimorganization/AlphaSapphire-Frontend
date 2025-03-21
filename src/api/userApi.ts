import { api } from "../Api";
interface User {
  id: number;
  name: string;
  email: string;
}
export async function getUsers(): Promise<any> {
  const response = await api.get("/api/users/");
  return response.data;
}
export async function getActiveUser(): Promise<any> {
  const response = await api.get("/api/users/me");
  return response.data;
}
