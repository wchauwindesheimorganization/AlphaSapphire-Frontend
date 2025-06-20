import { Mandate } from "../entities/Mandate";
import { ValidationRule } from "../entities/ValidationRule";
export const MandateValidation: ValidationRule<Mandate>[] = [
    { field: "MandateName", message: "Mandate Name is required" },
    { field: "DepartmentId", message: "Department Id is empty, contact app administrator" }
];
