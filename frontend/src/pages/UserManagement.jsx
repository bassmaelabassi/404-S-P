import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  User,
} from "lucide-react"

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userHistory, setUserHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)


  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_URL}/users?page=${currentPage}&search=${searchTerm}`
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.totalPages)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try again.")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, searchTerm])

  const handleUserSelect = async (selectedUser) => {
    setSelectedUser(selectedUser)
    setShowUserModal(true)

    try {
      setHistoryLoading(true)
      const response = await fetch(`${API_URL}/users/${selectedUser.id}/history`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setUserHistory(data.history)
      setHistoryLoading(false)
    } catch (error) {
      console.error("Error fetching user history:", error)
      setUserHistory([])
      setHistoryLoading(false)
    }
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Failed to delete user. Please try again.")
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getHistoryDetails = (item) => {
    switch (item.type) {
      case "email_change":
        return {
          icon: <Mail className="h-4 w-4 text-blue-600" />,
          title: "Changement d'email",
          description: `Email modifié de ${item.oldValue} à ${item.newValue}`,
          color: "blue",
        }
      case "phone_change":
        return {
          icon: <Phone className="h-4 w-4 text-green-600" />,
          title: "Changement de téléphone",
          description: `Téléphone modifié de ${item.oldValue} à ${item.newValue}`,
          color: "green",
        }
      case "name_change":
        return {
          icon: <Edit className="h-4 w-4 text-purple-600" />,
          title: "Changement de nom",
          description: `Nom modifié de ${item.oldValue} à ${item.newValue}`,
          color: "purple",
        }
      case "login":
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          title: "Connexion",
          description: `Connexion depuis l'IP ${item.newValue}`,
          color: "green",
        }
      case "password_reset":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
          title: "Réinitialisation de mot de passe",
          description: "Mot de passe réinitialisé",
          color: "yellow",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-600" />,
          title: "Activité",
          description: "Activité utilisateur",
          color: "gray",
        }
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
        <p className="text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto"></div>
  )
}

export default UserManagement