const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votreadresse@gmail.com',
    pass: 'votreMotdePasse'
  }
});

// Function to send email
const sendEmail = (email, code) => {
  const mailOptions = {
    from: 'votreadresse@gmail.com',
    to: email,
    subject: 'Votre code de quiz',
    text: `Votre code de quiz est : ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé :', info.response);
    }
  });
};

module.exports = sendEmail;
