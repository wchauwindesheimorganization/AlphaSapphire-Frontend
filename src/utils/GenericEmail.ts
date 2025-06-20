export const GenericEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z]+(?:\.[a-zA-Z]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
    return emailRegex.test(email)
}