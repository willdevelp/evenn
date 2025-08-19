export default function Register() {
    return (
        <form className="w-1/2 p-4">
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom</label>
                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>
            <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Role</label>
                <select name="role" id="role" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option value="utilisateur">Utilisateur</option>
                    <option value="organisateur">Organisateur</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Mot de passe</label>
                <input type="password" id="password" name="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">S'inscrire</button>
        </form>
    )
}