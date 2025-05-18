import { useState } from "react";

const Profile = () => {
  // Données initiales de l'utilisateur (par exemple, depuis un contexte ou des props)
  const utilisateurInitial = {
    nom: "John Doe",
    email: "john@example.com",
    telephone: "0600000000",
  };

  const [utilisateur, setUtilisateur] = useState(utilisateurInitial);
  const [formulaire, setFormulaire] = useState(utilisateurInitial);
  const [erreurs, setErreurs] = useState({});
  const [enEdition, setEnEdition] = useState(false);

  // Fonction simple pour valider les données
  const valider = () => {
    const nouvellesErreurs = {};
    if (!formulaire.nom.trim()) nouvellesErreurs.nom = "Le nom est obligatoire";
    if (!formulaire.email.includes("@")) nouvellesErreurs.email = "Email invalide";
    if (!formulaire.telephone.match(/^\d{10}$/)) nouvellesErreurs.telephone = "Le numéro doit contenir 10 chiffres";
    return nouvellesErreurs;
  };

  const gererChangement = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    const erreursValidation = valider();
    if (Object.keys(erreursValidation).length === 0) {
      setUtilisateur(formulaire);
      setEnEdition(false);
      setErreurs({});
      alert("Profil mis à jour avec succès");
    } else {
      setErreurs(erreursValidation);
    }
  };

  const gererAnnulation = () => {
    setFormulaire(utilisateur);
    setErreurs({});
    setEnEdition(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>

      {!enEdition ? (
        <div>
          <p><strong>Nom :</strong> {utilisateur.nom}</p>
          <p><strong>Email :</strong> {utilisateur.email}</p>
          <p><strong>Téléphone :</strong> {utilisateur.telephone}</p>
          <button
            onClick={() => setEnEdition(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Modifier
          </button>
        </div>
      ) : (
        <form onSubmit={gererSoumission}>
          <div className="mb-3">
            <label className="block mb-1">Nom :</label>
            <input
              type="text"
              name="nom"
              value={formulaire.nom}
              onChange={gererChangement}
              className="w-full border px-3 py-2 rounded"
            />
            {erreurs.nom && <p className="text-red-500 text-sm">{erreurs.nom}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-1">Email :</label>
            <input
              type="email"
              name="email"
              value={formulaire.email}
              onChange={gererChangement}
              className="w-full border px-3 py-2 rounded"
            />
            {erreurs.email && <p className="text-red-500 text-sm">{erreurs.email}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-1">Téléphone :</label>
            <input
              type="text"
              name="telephone"
              value={formulaire.telephone}
              onChange={gererChangement}
              className="w-full border px-3 py-2 rounded"
            />
            {erreurs.telephone && <p className="text-red-500 text-sm">{erreurs.telephone}</p>}
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Enregistrer
          </button>
          <button type="button" onClick={gererAnnulation} className="bg-gray-300 px-4 py-2 rounded">
            Annuler
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
