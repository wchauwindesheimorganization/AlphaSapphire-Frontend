import { Mandate } from "./Mandate";
import { Department } from "./Department";
export type User = {
  Id: number;
  Email: string;
  Department?: Department;
  DepartmentId?: number;
  KeyUser: boolean;
  FirstName: string;
  LastName: string;
  Administrator: boolean;
  Mandates: Mandate[];
};
