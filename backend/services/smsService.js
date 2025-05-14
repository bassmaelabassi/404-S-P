const sendSMS = async (to, message) => {
  console.log(`Mock SMS sent to: ${to}`);
  console.log(`Message: ${message}`);
  return true;
};

module.exports = { sendSMS };