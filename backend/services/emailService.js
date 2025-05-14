const sendEmail = async (to, subject, text) => {
  console.log(`Mock email sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  return true;
};

module.exports = { sendEmail };