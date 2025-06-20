export interface ValidationRule<T> {
    field: keyof T;
    message: string;
    check?: (value: string) => boolean;
}
