/*eslint-disable*/
import React, { useState } from 'react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Button, TextField, Typography, Box } from '@mui/material';
import Game from '../Quiz/quiz/Game';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDBox from 'components/MDBox';
import Footer from 'examples/Footer';

const PlayQuizEntry = () => {
  const [message, setMessage] = useState('');
  const [quizs, setQuizs] = useState([]);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const fetchAllQuiz = async () => {
    console.log('Fetching quizs with code:', message); // Debug log
    try {
      const response = await fetch(`http://localhost:1000/api/quiz/fetchallquiznoauthentication/${message}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch quizs');
      }
      const data = await response.json();
      console.log('Fetched quizs:', data); // Debug log
      setQuizs(data);
    } catch (error) {
      console.error('Error fetching quizs:', error);
      setError('Failed to fetch quizs. Please try again later.');
    }
  }

  const generateScore = () => {
    // Calculate score logic here
    const score = calculateScore();
    setScore(score);
  }

  const calculateScore = () => {
    // Implement logic to calculate score
    return 0; // Dummy value, replace with actual score calculation
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <Box p={2} border={1} borderRadius={5} boxShadow={3} bgcolor="background.paper">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            type="text"
            id="message"
            name="message"
            label="Enter quiz code"
            variant="outlined"
            onChange={handleChange}
            value={message}
            style={{ marginBottom: '16px', width: '300px' }}
          />
          <Button variant="contained" color="secondary" onClick={fetchAllQuiz} style={{ marginBottom: '16px', color: 'white' }}>
            Play
          </Button>
          {quizs.length > 0 &&
            <div style={{ marginBottom: '16px', width: '100%' }}>
              {quizs.map((quiz) => (
                <Game quiz={quiz} key={quiz._id} />
              ))}
            </div>
          }
          {score !== null &&
            <Typography variant="h5" style={{ marginBottom: '16px' }}>
              Your Score is: {score}
            </Typography>
          }
          <Button
            variant="contained"
            color="secondary"
            onClick={generateScore}
            disabled={quizs.length === 0 || score !== null}
            style={{ backgroundColor: '#FF0000', color: 'white' }}
          >
            Generate Score
          </Button>
        </div>
      </Box>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PlayQuizEntry;