"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true, // إذا كنت تستعمل JWT في cookies
        })
        setUser(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <p className="text-center">Chargement...</p>

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4 text-3xl">
          👤
        </div>
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.name || "Utilisateur"} !</h1>
        <p className="text-gray-600">Bienvenue dans votre tableau de bord</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 shadow rounded bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Nom</h3>
          <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
        </div>

        <div className="card p-6 shadow rounded bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
          <p className="text-lg font-semibold">{user?.email || "N/A"}</p>
        </div>

        <div className="card p-6 shadow rounded bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Rôle</h3>
          <p className="text-lg font-semibold capitalize">{user?.role || "user"}</p>
        </div>
      </div>

      <div className="card p-6 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 rounded-lg bg-gray-50">
              <p className="font-medium">Connexion depuis un nouvel appareil</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
