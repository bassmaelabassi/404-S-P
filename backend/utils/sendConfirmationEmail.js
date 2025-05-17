const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.BASE_URL}/api/auth/confirm/${token}`;

  await transporter.sendMail({
    from: `"Authentification App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Merci de vous être inscrit. Cliquez ici pour confirmer votre email :</p><a href="${url}">${url}</a>`,
  });
};

module.exports = sendConfirmationEmail;
