import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export async function Header() {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href="/">Evenn</Link>
                <AuthButton />
            </div>
        </header>
    )
}

export const AuthButton = async() => {
    const user = await getUser();
    if(user){
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <form action={
                            async () => {
                                "use server";
                                await auth.api.signOut({
                                    headers: await headers()
                                })
                                redirect('/login');
                            }
                        }>
                            <Button type="submit">
                                <LogOut size={8}/>
                                LogOut
                            </Button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            );
    }
}