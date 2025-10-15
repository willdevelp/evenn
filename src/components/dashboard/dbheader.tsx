import Link from "@/node_modules/next/link"

export default function DBHeader(){
  return(
    <div className="bg-white px-8 flex justify-between shadow-sm items-center w-full border py-2">
      <h1 className="text-2xl font-bold">Mbongue</h1>
      <div className="flex space-x-6 items-center">
        <Link href="/dashboard/events" className="text-gray-600 hover:underline font-bold">Mes évènements</Link>
        <Link href="/dashboard/reserves" className="text-gray-600 hover:underline font-bold">Mes Reservations</Link>
        <button className="bg-red-600 text-white px-2 py-2 rounded-sm">Déconnexion</button>
      </div>
    </div>
  )
}