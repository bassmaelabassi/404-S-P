import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get("http://localhost:5000/api/users");
        const logsResponse = await axios.get("http://localhost:5000/api/logs");

        setUsers(usersResponse.data);
        setLogs(logsResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const adminInfo = {
    name: "Nom de l'Admin",
    email: "admin@example.com",
    role: "Administrateur",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Nom</h2>
          <p>{adminInfo.name}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Email</h2>
          <p>{adminInfo.email}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Rôle</h2>
          <p>{adminInfo.role}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">{users.length}</h3>
          <p>Total des utilisateurs</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">5</h3>
          <p>Sessions actives</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">20%</h3>
          <p>Charge du serveur</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">1.2GB</h3>
          <p>Taille de la base de données</p>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nom</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Téléphone</th>
                  <th className="py-2 px-4 border-b">Statut</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.phone}</td>
                    <td className="py-2 px-4 border-b">
                      {user.isActive ? "Actif" : "Inactif"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Précédent
          </button>
          <button
            onClick={handleNextPage}
            disabled={indexOfLastUser >= users.length}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Suivant
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Logs d'activité</h2>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <ul className="bg-white rounded shadow p-4">
            {logs.map((log, index) => (
              <li key={index} className="border-b py-2">
                {log.timestamp} - {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
