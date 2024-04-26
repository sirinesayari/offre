/* eslint-disable */
import { useState, useEffect } from 'react';
import { Grid, Card, Stack, Typography, Divider, Button, Icon, Dialog, DialogTitle, DialogContent , DialogActions, Box  } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FeedBack from './feedback_ai';

export default function CaseFeedback({ interview, validated }) {
  const [hrFeedback, setHrFeedback] = useState(validated);
  const [feedbackText, setFeedbackText] = useState('');
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  useEffect(() => {
    setHrFeedback(validated);
  }, [validated]);

  const handleValidation = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/interviews/updateInterviewValidation/${interview._id}`);
      if (response.status === 200) {
        setHrFeedback(true);
      } else {
        console.error('le M.A.J de la validation a retourné :', response);
      }
    } catch (error) {
      console.error('Erreur lors de la validation de l\'interview :', error);
    }
  };

  const handleViewFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/feedbacks/getfeedback/${interview._id}`);
      setFeedbackText(response.data.text);
      setOpenViewDialog(true);
    } catch (error) {
       alert('Aucun feedback disponible.');
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
  };

  
  return (
    <Grid item xs={12} md={4} ml={1} mt={4} textAlign="center">
      <Card variant="outlined" sx={{ maxWidth: 360 }} style={{ height: '200px', width: '300px' }}>
        <Stack  justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h5" color="Black" component="div" ml={2} mt={1}>{interview.title}</Typography>
          <Typography variant="h6" color="red" mr={2}>{interview.typeIntrv}</Typography>
        </Stack>
        <Divider />
        <Stack direction="column" alignItems="center" p={2} mt={-2}>
          {hrFeedback ? (
              <Typography variant="body2" color="lightgreen" fontWeight={400} mb={0.6} mt={0.3}>Validée</Typography>
          ) : (
            <Button style={{ color: 'green'}} onClick={handleValidation}> Valider <Icon style={{ marginLeft: "10px", marginBottom: "1px" }} fontSize="small">event_available</Icon></Button>
          )}
          <Box display="flex" justifyContent="center" >
            <Button style={{  color:"Black" }}onClick={() => setOpenFeedbackDialog(true)}> Enregistrer FeedBack <Icon style={{ marginLeft: "8px", marginBottom: "1px"}}fontSize="small">graphic_eq</Icon></Button> 
            <Button style={{  color:"Black" }} onClick={handleViewFeedback} >Voir Feedback <Icon style={{ marginLeft: "8px", marginBottom: "1px"}}fontSize="small">visibility</Icon></Button>
          </Box>
        </Stack>
      </Card>
      <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog} maxWidth="md" fullWidth PaperProps={{style: {height: "90vh",margin: "5vh auto",},}} >
        <DialogContent>
          <FeedBack interviewId={interview._id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog} style={{  color:"Black" }}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} >
        <DialogTitle variant="h6" color="red" textAlign={'center'}>Feedback</DialogTitle>
        <DialogContent>
          <Typography>{feedbackText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} style={{  color:"Black" }}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

