/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography, Container, Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function MyCandidatures({ userId }) {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/candidature/user/${userId}`);
        setCandidatures(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidatures:", error);
      }
    };

    fetchCandidatures();
  }, [userId]);

  return (
    <DashboardLayout>
    <Container>
    <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={-5}
        mt={1}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Mes candidatures 
        </MDTypography>
      </MDBox>
      {loading ? (
        <Typography variant="body1">Chargement en cours...</Typography>
      ) : (
        candidatures.map((candidature) => (
          <Card key={candidature._id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6">Offre: {candidature.offre.title}</Typography>
            <Typography variant="body1">Nom: {candidature.nom}</Typography>
            <Typography variant="body1">Email: {candidature.email}</Typography>
            <Typography variant="body1">Spécialité: {candidature.specialite}</Typography>
            {/* Ajoutez d'autres informations de candidature ici si nécessaire */}
          </Card>
        ))
      )}
    </Container>
    </DashboardLayout>
  );
}

export default MyCandidatures;