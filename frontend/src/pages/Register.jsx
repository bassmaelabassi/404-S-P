"use client"

import { useFormik } from "formik"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { registerSchema } from "../utils/validation"

const Register = () => {
  const { register, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "", 
    acceptTerms: false,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { acceptTerms, ...userData } = values

      try {
        const success = await register(userData)
        if (!success) {
          formik.resetForm()
        }
      } catch (error) {
        console.error("Registration failed:", error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const checkPasswordStrength = (password) => {
    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    setPasswordStrength(score)
  }

  const handlePasswordChange = (e) => {
    const { value } = e.target
    formik.handleChange(e)
    checkPasswordStrength(value)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Faible"
    if (passwordStrength <= 3) return "Moyen"
    return "Fort"
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>

      {formik.status?.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {formik.status.error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">Nom complet</label>
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            }`}
            placeholder="Entrez votre nom complet"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              formik.touched.email && formik.errors.email ? "border-red-500" : ""
            }`}
            placeholder="Entrez votre email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-2">Téléphone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              formik.touched.phone && formik.errors.phone ? "border-red-500" : ""
            }`}
            placeholder="Entrez votre numéro de téléphone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-gray-700 mb-2">Rôle</label>
          <select
            id="role"
            name="role"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              formik.touched.role && formik.errors.role ? "border-red-500" : ""
            }`}
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">-- Sélectionnez un rôle --</option>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Mot de passe</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                formik.touched.password && formik.errors.password ? "border-red-500" : ""
              }`}
              placeholder="Créez un mot de passe"
              value={formik.values.password}
              onChange={handlePasswordChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <span className="text-gray-500">Cacher</span>
              ) : (
                <span className="text-gray-500">Voir</span>
              )}
            </button>
          </div>
          {formik.values.password && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p
                className={`text-xs mt-1 ${
                  passwordStrength <= 2 ? "text-red-500" : passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {getPasswordStrengthText()}
              </p>
            </div>
          )}
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-400 transition duration-200"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
          ) : (
            "Créer un compte"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte?{" "}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
