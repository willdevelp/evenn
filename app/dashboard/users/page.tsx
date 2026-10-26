// app/dashboard/users/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MoreVertical, Eye, Edit, Ban, UserCheck, UserX, Mail } from "lucide-react";

// Types
type User = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  eventsBooked: number;
  status: "active" | "inactive" | "suspended";
  avatar?: string;
};

// Données mockées
const mockUsers: User[] = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie@example.com",
    joinedDate: "2025-08-15",
    eventsBooked: 12,
    status: "active",
  },
  {
    id: "2",
    name: "Jean Martin",
    email: "jean@example.com",
    joinedDate: "2025-09-20",
    eventsBooked: 8,
    status: "active",
  },
  {
    id: "3",
    name: "Sophie Lefèvre",
    email: "sophie@example.com",
    joinedDate: "2025-10-05",
    eventsBooked: 5,
    status: "inactive",
  },
  {
    id: "4",
    name: "Lucas Bernard",
    email: "lucas@example.com",
    joinedDate: "2025-11-12",
    eventsBooked: 3,
    status: "suspended",
  },
  {
    id: "5",
    name: "Emma Petit",
    email: "emma@example.com",
    joinedDate: "2025-12-01",
    eventsBooked: 7,
    status: "active",
  },
  {
    id: "6",
    name: "Paul Dubois",
    email: "paul@example.com",
    joinedDate: "2026-01-10",
    eventsBooked: 2,
    status: "inactive",
  },
  {
    id: "7",
    name: "Claire Moreau",
    email: "claire@example.com",
    joinedDate: "2026-02-14",
    eventsBooked: 9,
    status: "active",
  },
  {
    id: "8",
    name: "Thomas Leroy",
    email: "thomas@example.com",
    joinedDate: "2026-03-22",
    eventsBooked: 4,
    status: "suspended",
  },
];

// Composant Badge de statut
const StatusBadge = ({ status }: { status: User["status"] }) => {
  const config = {
    active: { label: "Actif", className: "bg-green-100 text-green-700" },
    inactive: { label: "Inactif", className: "bg-gray-100 text-gray-700" },
    suspended: { label: "Suspendu", className: "bg-red-100 text-red-700" },
  };
  const { label, className } = config[status];
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}>{label}</span>;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrage
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Formatter date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Utilisateurs</h1>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total : {filtered.length}
          </span>
        </div>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Utilisateur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Inscrit le</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Événements</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(user.joinedDate)}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">{user.eventsBooked}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition" title="Voir le détail">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition" title="Modifier">
                          <Edit className="h-4 w-4 text-indigo-500" />
                        </button>
                        {user.status === "active" && (
                          <button className="p-1 hover:bg-red-100 rounded transition" title="Suspendre">
                            <Ban className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                        {user.status === "suspended" && (
                          <button className="p-1 hover:bg-green-100 rounded transition" title="Réactiver">
                            <UserCheck className="h-4 w-4 text-green-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {paginated.length > 0 && (
                <>
                  {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}
                </>
              )}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






// "use client";

// import { useState, useEffect } from "react";
// import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaEnvelope, FaPhone } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: "admin" | "organisateur" | "utilisateur";
//   status: "actif" | "inactif";
//   createdAt: string;
// }

// export default function UsersPage() {
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState<string>("tous");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("/api/users");
//         const data = await res.json();
//         setUsers(data);
//       } catch (error) {
//         console.error("Erreur chargement utilisateurs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter === "tous" || user.role === roleFilter;
//     return matchesSearch && matchesRole;
//   });

//   const getRoleBadge = (role: string) => {
//     const styles = {
//       admin: "bg-purple-100 text-purple-700",
//       organisateur: "bg-blue-100 text-blue-700",
//       utilisateur: "bg-gray-100 text-gray-700",
//     };
//     return styles[role as keyof typeof styles] || "bg-gray-100 text-gray-700";
//   };

//   const getStatusBadge = (status: string) => {
//     return status === "actif"
//       ? "bg-green-100 text-green-700"
//       : "bg-red-100 text-red-700";
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;
//     try {
//       await fetch(`/api/users/${id}`, { method: "DELETE" });
//       setUsers((prev) => prev.filter((u) => u.id !== id));
//     } catch (error) {
//       console.error("Erreur suppression:", error);
//       alert("Erreur lors de la suppression");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-12 bg-gray-200 rounded"></div>
//           <div className="space-y-3">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="h-16 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* En-tête */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
//           <p className="text-gray-500 mt-1">Gérez tous les utilisateurs de la plateforme</p>
//         </div>
//         <button
//           onClick={() => router.push("/dashboard/users/create")}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           <FaUserPlus />
//           Ajouter un utilisateur
//         </button>
//       </div>

//       {/* Filtres */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="flex-1 relative">
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Rechercher par nom, email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <select
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="tous">Tous les rôles</option>
//           <option value="admin">Admin</option>
//           <option value="organisateur">Organisateur</option>
//           <option value="utilisateur">Utilisateur</option>
//         </select>
//       </div>

//       {/* Liste */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredUsers.map((user) => (
//           <div
//             key={user.id}
//             className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <FaEnvelope className="w-3 h-3 text-gray-400" />
//                   <span className="text-sm text-gray-500">{user.email}</span>
//                 </div>
//                 {user.phone && (
//                   <div className="flex items-center gap-2 mt-1">
//                     <FaPhone className="w-3 h-3 text-gray-400" />
//                     <span className="text-sm text-gray-500">{user.phone}</span>
//                   </div>
//                 )}
//               </div>
//               <span
//                 className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
//                   user.status
//                 )}`}
//               >
//                 {user.status}
//               </span>
//             </div>

//             <div className="mt-4 flex items-center gap-2">
//               <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(user.role)}`}>
//                 {user.role}
//               </span>
//               <span className="text-xs text-gray-400 ml-auto">
//                 Inscrit le {new Date(user.createdAt).toLocaleDateString()}
//               </span>
//             </div>

//             <div className="mt-4 flex gap-2 border-t pt-4">
//               <button
//                 onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
//                 className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
//               >
//                 <FaEdit />
//                 Modifier
//               </button>
//               <button
//                 onClick={() => handleDelete(user.id)}
//                 className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition"
//               >
//                 <FaTrash />
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredUsers.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500">Aucun utilisateur trouvé</p>
//         </div>
//       )}
//     </div>
//   );
// }