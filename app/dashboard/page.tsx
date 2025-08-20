import { getUser } from "@/lib/auth-server";

export default async function DashboardPage() {
    const user = await getUser();
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <p>{user?.name}</p>
                <p>{user?.email}</p>
            </div>
        </div>
    )
}