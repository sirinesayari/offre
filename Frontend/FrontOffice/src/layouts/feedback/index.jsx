/* eslint-disable */
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Card, CardContent, Icon } from '@mui/material';
import axios from 'axios';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import CaseFeedback from './CaseFeedback';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

function Feedback() {
  const [StudentName, setStudentName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);


  const handleSearchClick = async () => {
    try {
      console.log('Nom de l\'étudiant:', StudentName);
      const response = await axios.get(`http://localhost:5000/interviews/getInterviewsByStudentName/${StudentName}`);
      setSearchResult(response.data);
      setSearchPerformed(true); 
    } catch (error) {
      console.error('Error searching interviews:', error.message);
      setSearchResult([]);
      setSearchPerformed(true);
    }
  };

  console.log('searchResult:', searchResult);
  function InterviewList() {
    return (
      <Box  display="flex" justifyContent="center" mt={10}>
        <Grid container >
        {searchPerformed && searchResult.length === 0 ? (
          <Typography variant="body1">Aucun entretien trouvé pour ce candidat.</Typography>
        ) : (
          searchResult.map((interview, index) => (
            <Grid item key={index}>
              <CaseFeedback interview={interview} validated={interview.validated} key={index} />
            </Grid>
          ))
        )}
        </Grid>
      </Box>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <MDBox mt={10} mb={5} ml={4}>
          <Typography variant='h1' justifyContent="center" alignItems="center" ml={10} >Trouvez le candidat auquel vous voulez <br /> donner un feedback !</Typography> 
            <Grid container justifyContent="center" alignItems="center">
              <Box display="flex" justifyContent="center" mt={-8} ml={35}>
                <TextField
                  label="Nom du candidat"
                  variant="outlined"
                  value={StudentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <Button variant="contained" style={{backgroundColor:"red" , color: 'white'}} onClick={handleSearchClick}>Cherchez<Icon style={{ marginLeft: "10px" }} fontSize="small">search</Icon></Button>
              </Box>
            </Grid>
            <Grid container justifyContent="center" alignItems="center">
              <InterviewList />
            </Grid>
        </MDBox>
    </DashboardLayout>
  );
}

export default Feedback;
