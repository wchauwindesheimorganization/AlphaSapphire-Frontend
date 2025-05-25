import { ValidationRule } from "../entities/ValidationRule";
import { Department } from "../entities/Department";
export const Departmentvalidation: ValidationRule<Department>[] = [
    { field: "DepartmentCode", message: "Department Code is required" },

];
