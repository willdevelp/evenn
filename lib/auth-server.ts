import { headers } from "next/headers";
import { auth } from "./auth";

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    return session;
}

export const getUser = async () => {
    const session = await getSession();
    return session?.user;
}