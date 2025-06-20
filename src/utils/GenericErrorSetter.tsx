export default function GenericErrorSetter({
    error,
    setErrors,
}: {
    error: any;
    setErrors: React.Dispatch<React.SetStateAction<{ id: number; errormessage: string }[] | null | undefined>>;
}) {
    if (error instanceof Error && (error as any).response?.data) {
        const errorsWithId = (error as any).response.data.map(
            (errormessage: string, id: number) => ({
                id,
                errormessage,
            })
        );
        setErrors(errorsWithId);
    } else {
        console.error("Unexpected error:", error);
        setErrors([{ errormessage: "An unexpected error occurred.", id: 1 }]);
    }
}
