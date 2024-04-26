/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper,   Box, Typography, Button} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";

const ArchivedCandidatures = () => {
  const [archivedCandidatures, setArchivedCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
  };
  const cellStyles = {
    padding: "8px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    fontSize: "12px",
  };
  
  const evenRowStyles = {
    backgroundColor: "#f2f2f2",
  };
  
  const headerStyles = {
    ...cellStyles,
    color: "red",
    textAlign: "center",
  };

  useEffect(() => {
    const fetchArchivedCandidatures = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/candidature/archived");
        setArchivedCandidatures(response.data);
      } catch (error) {
        console.error("Error fetching archived candidatures:", error);
        setError("Error fetching archived candidatures");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedCandidatures();
  }, []);

  const desarchiverCandidature = async (candidatureId, offerId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/candidature/${candidatureId}/unarchive`
      );
      console.log(response.data);
      alert("Candidature désarchivée avec succès");
      // Mettre à jour l'état local pour exclure la candidature désarchivée
      setArchivedCandidatures((prevCandidatures) =>
        prevCandidatures.filter((candidature) => candidature._id !== candidatureId)
      );
    } catch (error) {
      console.error("Erreur lors du désarchivage de la candidature :", error);
      setError("Erreur lors du désarchivage de la candidature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <Box sx={{ padding: "20px" }}>
    <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={-0.1}
        mt={1}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Candidatures archivées
        </MDTypography>
      </MDBox>
    <TableContainer component={Paper}>
    <table style={tableStyles}>
          <thead>
            <tr>
              <th style={headerStyles}>Nom</th>
              <th style={headerStyles}>Email</th>
              <th style={headerStyles}>Specialite</th>
              <th style={headerStyles}>Cv</th>
              <th style={headerStyles}>Lettre de motivation</th>
              <th style={headerStyles}>Status</th>
              <th style={headerStyles}>Action</th>
            </tr>
          </thead>
        <TableBody>
          {archivedCandidatures.map((candidature) => (
            <TableRow key={candidature._id}>
              <TableCell>{candidature.nom}</TableCell>
              <TableCell>{candidature.email}</TableCell>
              <TableCell>{candidature.specialite}</TableCell>
              <TableCell>
                <a href={`http://localhost:5000/${candidature.cv}`} target="_blank" rel="noopener noreferrer">
                  Voir CV
                </a>
              </TableCell>
              <TableCell>
                <a href={`http://localhost:5000/${candidature.lettreMotivation}`} target="_blank" rel="noopener noreferrer">
                  Voir Lettre de Motivation
                </a>
              </TableCell>
              <TableCell>{candidature.status}</TableCell>
              <Button onClick={() => desarchiverCandidature(candidature._id, candidature.offerId)} disabled={loading}>
          {loading ? "En cours..." : "Désarchiver"}
          </Button>
          <Button
        onClick={() => window.history.back()}
      >
        Retour
      </Button>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </TableContainer>
  </Box>
  <Footer/>
</DashboardLayout>
  );
};

export default ArchivedCandidatures;