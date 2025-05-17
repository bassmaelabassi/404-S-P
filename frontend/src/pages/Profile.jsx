import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const schema = yup.object().shape({
  username: yup.string().min(3),
  email: yup.string().email(),
  phone: yup.string()
})

export default function Profile() {
  const { user, logout } = useAuth()
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setProfile(res.data)
        reset(res.data)
      } catch (err) {
        showNotification({
          type: 'error',
          message: 'Failed to fetch profile'
        })
      }
    }

    fetchProfile()
  }, [reset, showNotification])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const res = await axios.put('/api/user/profile', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      showNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      })
      setProfile(res.data.user)
    } catch (err) {
      showNotification({
        type: 'error',
        message: err.response?.data?.message || 'Update failed'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={profile.username}
                  {...register('username')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  {...register('email')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                {profile.isVerified?.email ? (
                  <p className="mt-1 text-sm text-green-600">Email verified</p>
                ) : (
                  <p className="mt-1 text-sm text-yellow-600">Email not verified</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone}
                  {...register('phone')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
                {profile.isVerified?.phone ? (
                  <p className="mt-1 text-sm text-green-600">Phone verified</p>
                ) : (
                  <p className="mt-1 text-sm text-yellow-600">Phone not verified</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}