import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('Verifying your email...')
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/auth/confirm/${token}`)
        setMessage('Email verified successfully! You can now login.')
        setTimeout(() => navigate('/login'), 3000)
      } catch (err) {
        setError(err.response?.data?.msg || 'Verification failed')
      }
    }
    verifyEmail()
  }, [token, navigate])

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>{message}</div>
      )}
    </div>
  )
}

export default VerifyEmail