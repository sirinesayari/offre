/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    text: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/offer/send-email', emailData);
      console.log(response.data);
      alert('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email');
    }
  };

  return (
    <div className="App">
      <h1>Envoi d'Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Destinataire:</label>
          <input type="email" name="to" value={emailData.to} onChange={handleChange} required />
        </div>
        <div>
          <label>Sujet:</label>
          <input type="text" name="subject" value={emailData.subject} onChange={handleChange} required />
        </div>
        <div>
          <label>Message:</label>
          <textarea name="text" value={emailData.text} onChange={handleChange} required />
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default App;
