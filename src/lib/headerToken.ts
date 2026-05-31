import { auth } from "@/auth";

export default async function headerToken() {
    const session = await auth();
    console.log(session?.access_token)

    return  {
        "Content-Type" : "application/json",
        Authorization: `Bearer ${session?.access_token}`
    }
}