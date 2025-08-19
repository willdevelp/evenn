import '../globals.css'
export default function LoginPage() {
    return (
        <div className="container mx-auto flex flex-col items-center p-4">
            <form action="" className="w-1/2 p-4">
                <h1 className="text-3xl font-bold mb-4 text-center">Se connecter</h1>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                    <input type="password" id="password" name="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Se connecter</button>
                </div>
            </form>
        </div>
    )
}