const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arisjoharie@gmail.com',
    pass: 'afvqgjlsiprecezf'
  },
  tls: { rejectUnauthorized: false }
})