"use client"

import { useFormik } from "formik"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Lock, ArrowLeft, Check, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { resetPasswordSchema } from "../utils/validation"

const PasswordInput = ({ id, label, show, toggleShow, formik, placeholder }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...formik.getFieldProps(id)}
        className={`w-full pl-10 pr-10 border rounded-md py-2 focus:outline-none ${
          formik.touched[id] && formik.errors[id] ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        tabIndex={-1}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {formik.touched[id] && formik.errors[id] && (
      <p className="text-red-500 text-sm mt-1">{formik.errors[id]}</p>
    )}
  </div>
)

const ResetPassword = () => {
  const { resetPassword } = useAuth()
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [strength, setStrength] = useState(0)

  const checkStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    setStrength(score)
  }

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const success = await resetPassword(token, values.password)
        if (success) {
          setResetSuccess(true)
          setTimeout(() => navigate("/login"), 3000)
        }
      } catch (e) {
        console.error(e)
      }
    },
  })

  const handlePwdChange = (e) => {
    formik.handleChange(e)
    checkStrength(e.target.value)
  }

  if (!token)
    return (
      <MessageCard
        icon={<Lock size={32} className="text-red-600" />}
        title="Lien invalide"
        text="Le lien de réinitialisation du mot de passe est invalide ou a expiré."
        btnText="Demander un nouveau lien"
        btnLink="/forgot-password"
        btnColor="btn-primary"
      />
    )

  if (resetSuccess)
    return (
      <MessageCard
        icon={<Check size={32} className="text-green-600" />}
        title="Mot de passe réinitialisé!"
        text="Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion..."
        btnText="Aller à la connexion"
        btnLink="/login"
        btnColor="btn-primary"
      />
    )

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow">
      <div className="text-center mb-6">
        <Lock size={40} className="mx-auto text-primary-600 mb-2" />
        <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
        <p className="text-gray-500 mt-1">Créez un nouveau mot de passe pour votre compte</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <PasswordInput
          id="password"
          label="Nouveau mot de passe"
          show={showPassword}
          toggleShow={() => setShowPassword((v) => !v)}
          placeholder="Créez un nouveau mot de passe"
          formik={{ ...formik, handleChange: handlePwdChange }}
        />

        {formik.values.password && (
          <PasswordStrengthBar strength={strength} />
        )}

        <PasswordInput
          id="confirmPassword"
          label="Confirmer le mot de passe"
          show={showConfirm}
          toggleShow={() => setShowConfirm((v) => !v)}
          placeholder="Confirmez votre nouveau mot de passe"
          formik={formik}
        />

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full btn btn-primary flex items-center justify-center py-2.5"
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <Lock size={20} className="mr-2" />
              Réinitialiser le mot de passe
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}

const PasswordStrengthBar = ({ strength }) => {
  const colors = ["bg-red-500", "bg-red-500", "bg-yellow-500", "bg-yellow-500", "bg-green-500", "bg-green-500"]
  const texts = ["Très faible", "Très faible", "Faible", "Moyen", "Fort", "Très fort"]
  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${colors[strength] || "bg-gray-200"}`} style={{ width: `${(strength / 5) * 100}%` }} />
      </div>
      <p className={`text-xs mt-1 ${colors[strength] || "text-gray-400"}`}>{texts[strength] || ""}</p>
    </div>
  )
}

const MessageCard = ({ icon, title, text, btnText, btnLink, btnColor }) => (
  <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4">{icon}</div>
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-600 mt-4">{text}</p>
    <Link to={btnLink} className={`mt-6 inline-block w-full py-2 btn ${btnColor}`}>
      {btnText}
    </Link>
  </div>
)

export default ResetPassword
