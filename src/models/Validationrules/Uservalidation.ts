import { GenericEmail } from "@/utils/GenericEmail";
import { ArcadisEmail } from "@/utils/ArcadisEmail";
import { User } from "@/models/entities/User";
import { ValidationRule } from "../entities/ValidationRule";
export const Uservalidation: ValidationRule<User>[] = [
    { field: "FirstName", message: "First name is required" },
    { field: "LastName", message: "Last name is required" },
    { field: "Email", message: "Email is required" },
    { field: "DepartmentId", message: "Department Id is empty, contact app administrator", check: (value) => !!value },
    { field: "Email", message: "Must be valid email", check: GenericEmail },
    { field: "Email", message: "Email must belong to the '@arcadis.com' domain", check: ArcadisEmail }
];
