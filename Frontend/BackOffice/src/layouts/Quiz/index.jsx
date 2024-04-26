/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { Link } from '@mui/icons-material';
import MDButton from 'components/MDButton';
import { useNavigate } from 'react-router-dom';
const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedThematique, setSelectedThematique] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [quizPublished, setQuizPublished] = useState(false); // État pour suivre si le quiz a été publié

  // Méthode pour générer un code aléatoire
  const generateCode = () => {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/question/getByNiveauAndThematique/${selectedNiveau}/${selectedThematique}`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleGenerateCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
  };

  const handlePublishQuiz = () => {
    // Mettre en œuvre la logique pour publier le quiz ici
    // Par exemple, envoyer les questions au backend pour sauvegarder dans la base de données
    // Vous pouvez utiliser une requête POST avec Axios pour cela
    // Une fois le quiz publié avec succès, mettez à jour l'état quizPublished à true
    setQuizPublished(true);
  };
  const navigate = useNavigate();

  const handlePasserAuxQuestions = () => {
    navigate('/Question');
  };



  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Quiz</h1>
        <div style={styles.selectWrapper}>
          <label htmlFor="niveau" style={styles.label}>Select niveau:</label>
          <select id="niveau" value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)} style={styles.select}>
            <option value="">Select Niveau</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
        <div style={styles.selectWrapper}>
          <label htmlFor="thematique" style={styles.label}>Select thématique:</label>
          <select id="thematique" value={selectedThematique} onChange={(e) => setSelectedThematique(e.target.value)} style={styles.select}>
            <option value="">Select Thématique</option>
            <option value="informatique">Informatique</option>
            <option value="electrique">Electrique</option>
            <option value="telecommunication">Telecommunication</option>
            <option value="mecanique">Mecanique</option>
            <option value="mécatronique">Mécatronique</option>
            <option value="génie civil">Génie Civil</option>
            <option value="historique">Historique</option>
          </select>
        </div>
        <div style={styles.buttonWrapper}>
          <button onClick={handleSubmit} style={styles.button}>Afficher</button>
          {questions.length > 0 && <button onClick={handleGenerateCode} style={styles.button}>Générer Code</button>}
          {/* Bouton pour publier le quiz */}
          {questions.length > 0 && !quizPublished && <button onClick={handlePublishQuiz} style={styles.button}>Publier le Quiz</button>}
        </div>
        <button style={styles.button} onClick={handlePasserAuxQuestions}>
          Passer aux questions
        </button>

     
        {loading && <div style={styles.message}>Loading questions...</div>}
        {error && <div style={styles.message}>Error fetching questions: {error.message}</div>}
        {questions.length > 0 && (
          <div style={styles.questions}>
            {questions.map((question, index) => (
              <div key={index} style={styles.question}>
                <h3>Question {index + 1}</h3>
                <p>{question.text}</p>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {generatedCode && (
          <div style={styles.generatedCode}>
            Generated Code: {generatedCode}
          </div>
        )}
        {quizPublished && (
          <div style={styles.message}>Le quiz a été publié avec succès !</div>
        )}
      
      </div>
      

    </DashboardLayout>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  selectWrapper: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonWrapper: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'red',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#f00',
  },
  questions: {
    marginTop: '20px',
  },
  question: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  generatedCode: {
    marginTop: '20px',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default Quiz;