const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sirine.sayari@gmail.com',
    pass: 'sirine22'
  }
});

// Function to send email
const Email = (email, code) => {
  const mailOptions = {
    from: 'sirine.sayari@gmail.com',
    to: email,
    subject: 'Votre code de quiz',
    text: `Votre code de quiz est : ${code}`
  };

  transporter.Mail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé :', info.response);
    }
  });
};

module.exports = Email;
