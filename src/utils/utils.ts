export function extractUserFromEmail(email: string): string {
    const userEmail = email.split("@")[0];
    return userEmail;
}