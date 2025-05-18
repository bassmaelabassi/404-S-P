import { useFormik } from "formik"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { forgotPasswordSchema } from "../utils/validation"

const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")
  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        const success = await forgotPassword(values.email)
        if (success) {
          setEmailSent(true)
          setSentEmail(values.email)
          setError(null)
        }
      } catch (error) {
        setError("Une erreur s'est produite. Veuillez réessayer.")
        console.error("Forgot password error:", error)
      }
    },
  })

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Email envoyé!</h1>
          <p className="text-gray-600 mt-4"> Nous avons envoyé un email <strong>{sentEmail}</strong></p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm"> Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier</p>
          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="button"
              className="w-full bg-amber-600 text-gray-800 py-2 px-4 rounded-lg hover:bg-amber-300 transition duration-200"
              onClick={() => setEmailSent(false)}
            >
              Revenir au formulaire
            </button>

            <Link
              to="/login"
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-400 transition duration-200 text-center"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Mot de passe oublié?</h1>
        <p className="text-gray-500 mt-2"> Entrez votre adresse email </p>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              formik.touched.email && formik.errors.email ? "border-red-500" : ""
            }`}
            placeholder="Entrez votre adresse email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-400 transition duration-200"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
          ) : (
            "Envoyer les instructions"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-amber-600 hover:text-amber-700 font-medium"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword