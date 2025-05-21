import { ValidationRule } from "@/models/entities/ValidationRule";

export default function GenericAdd<T>(validationRules: ValidationRule<T>[], sanitizedEntity: T) {
    const errors: string[] = validationRules.reduce<string[]>((errors, { field, message, check }) => {
        const value = sanitizedEntity[field];
        if (!value || (check && !check(String(value)))) {
            errors.push(message);
        }
        return errors;
    }, []);
    if (errors.length > 0) {
        const error = new Error("An error occurred!") as Error & { response?: { data: Array<string> } };
        error.response = { data: errors };
        throw error;
    }

}