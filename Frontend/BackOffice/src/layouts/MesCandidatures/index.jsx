import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function CandidatureCandidat() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCandidatures() {
      setLoading(true);
      try {
        // Récupérer les candidatures associées au candidat authentifié
        const response = await axios.get("http://localhost:5000/candidature/candidat");
        setCandidatures(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des candidatures.");
      } finally {
        setLoading(false);
      }
    }
    fetchCandidatures();
  }, []);

  return (
   <DashboardLayout>
                <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={1}
            mt={1}
            p={2}
            mb={3}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Mes Candidatures 
            </MDTypography>
          </MDBox>      {loading && <Typography variant="body1" align="center">Chargement en cours...</Typography>}
      {error && <Typography variant="body1" align="center" color="error">{error}</Typography>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Offre</TableCell>
                <TableCell>Date de Candidature</TableCell>
                {/* Ajoutez d'autres colonnes au besoin */}
              </TableRow>
            </TableHead>
            <TableBody>
              {candidatures.map((candidature) => (
                <TableRow key={candidature._id}>
                  <TableCell>{candidature.offre}</TableCell>
                  <TableCell>{candidature.date}</TableCell>
                  {/* Ajoutez d'autres cellules au besoin */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DashboardLayout>

  );
}

export default CandidatureCandidat;
