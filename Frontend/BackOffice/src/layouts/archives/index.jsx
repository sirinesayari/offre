/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

const ArchivedCandidatures = () => {
  const [archivedCandidatures, setArchivedCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setArchivedCandidatures(prevCandidatures =>
        prevCandidatures.filter(candidature => candidature._id !== candidatureId)
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
        <Typography variant="h5" gutterBottom>
          Candidatures archivées
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Spécialité</th>
                <th>Cv</th>
                <th>Lettre de motivation</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <TableBody>
              {archivedCandidatures.map(candidature => (
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
                  <TableCell>
                    <button onClick={() => desarchiverCandidature(candidature._id, candidature.offerId)} disabled={loading}>
                      {loading ? "En cours..." : "Désarchiver"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
        variant="contained"
        color="secondary"
        onClick={() => window.history.back()}
        sx={{ backgroundColor: "grey" }} 
      >
        Retour
      </Button>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};

export default ArchivedCandidatures;