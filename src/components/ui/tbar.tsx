import { LogOut } from "lucide-react"
import { headers } from "next/headers";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default function TBar(){
    return(
        <div className="w-1/5 h-full bg-white fixed border-gray-200 border space-y-6 p-4 flex flex-col justify-between">
            <div className="space-y-12">
                <div className="flex items-center gap-4">
                <h1 className="bg-slate-900 py-2 px-3 rounded text-white font-bold text-3xl">A</h1>
                <div>
                    <p className="font-bold">Acme  Inc</p>
                    <p>Acme@gmail.com</p>
                </div>
            </div>
            <div className="space-y-3">
                <p className="font-bold">Accueil</p>
                <p className="font-bold">Renouveau</p>
                <p className="font-bold">Allons Allons</p>
            </div>
            </div>
            <form action="">
                <button className="flex border p-2 space-x-2 bg-red-600 items-center rounded-sm" formAction={async () => {
                    "use server";
                    await auth.api.signOut({
                        headers: await headers(),
                    });

                    redirect("/");
                }}>
                <LogOut color="white" size={20}/>
                <p className="text-white rounded">Se deconnecter</p>  
            </button>
            </form>
        </div>
    )
}