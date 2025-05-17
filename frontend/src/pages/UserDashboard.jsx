import { useState, useEffect } from 'react'
import { useAuth } from '../Context/AuthContext'
import api from '../services/api'

const UserDashboard = () => {
  const { user } = useAuth()
  const [changeHistory, setChangeHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchChangeHistory = async () => {
      try {
        // For admin users, we can fetch all changes
        // For regular users, we would typically fetch only their changes
        // Here we'll implement the admin version since your backend has this route
        if (user?.role === 'admin') {
          const { data } = await api.get('/user/admin/changes')
          setChangeHistory(data)
        } else {
          // For regular users, you would need to implement a separate endpoint
          // like '/user/me/changes' in your backend
          // For now we'll show a message
          setError('Change history is only available for admin users')
        }
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch change history')
      } finally {
        setLoading(false)
      }
    }

    fetchChangeHistory()
  }, [user])

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Username:</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600">Account Status:</p>
              <p className="font-medium">
                {user?.isConfirmed ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending verification</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Changes</h2>
            {changeHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">User</th>
                      <th className="py-3 px-4 text-left">Field</th>
                      <th className="py-3 px-4 text-left">Old Value</th>
                      <th className="py-3 px-4 text-left">New Value</th>
                      <th className="py-3 px-4 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeHistory.map((log, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 border-b">
                          {log.userId?.username || 'Unknown'} ({log.userId?.email || 'Unknown'})
                        </td>
                        <td className="py-3 px-4 border-b capitalize">{log.field}</td>
                        <td className="py-3 px-4 border-b">{log.oldValue || '-'}</td>
                        <td className="py-3 px-4 border-b">{log.newValue || '-'}</td>
                        <td className="py-3 px-4 border-b">
                          {new Date(log.changedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No change history found</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard