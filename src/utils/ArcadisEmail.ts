export const ArcadisEmail = (email: string) => {
    return email.split("@")[1] == "arcadis.com"
}