/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Styled components
const StyledContainer = styled(TableContainer)`
  margin-bottom: 20px;
`;

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

function CandidatureList({ candidature = {} }) {
  const [offres, setOffres] = useState([]);
  const [candidaturesParOffre, setCandidaturesParOffre] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [archivedCandidatures, setArchivedCandidatures] = useState([]);
  const [success, setSuccess] = useState(false);


        const accepterCandidature = async (candidatureId, offerId) => {
          setLoading(true);
          try {
            // Envoyer une requête POST pour accepter la candidature
            const response = await axios.post(`http://localhost:5000/candidature/offer/${offerId}/candidature/${candidatureId}/accept`, {
              candidatureId: candidatureId,
              offerId: offerId
            });
      
            // Vérifier la réponse du serveur et envoyer un SMS si nécessaire
            if (response.status === 200) {
              await sendSMS(candidatureId);
              alert("Candidature acceptée avec succès !");
            } else {
              alert("Erreur lors de l'acceptation de la candidature !");
            }
          } catch (error) {
            console.error("Error accepting candidature:", error);
            alert("Failed to accept candidature. Please try again.");
          } finally {
            setLoading(false);
          }
        };
      
        const sendSMS = async (candidatureId) => {
          try {
            // Envoyer une requête POST pour envoyer un SMS
            await axios.post(`http://localhost:5000/candidature/send-sms`, {
              recipientNumber: '+21623099545', // Remplacez par le numéro de téléphone du candidat
              message: `Votre candidature avec l'ID ${candidatureId} a été acceptée.`
            });
          } catch (error) {
            console.error("Error sending SMS:", error);
          }
        };
      


  const refuserCandidature = async (candidatureId, offerId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/candidature/offer/${offerId}/candidature/${candidatureId}/reject`
      );
      console.log(response.data);
      alert("Candidature refusée avec succès");
      // Gérer la réponse si nécessaire
    } catch (error) {
      console.error("Erreur lors du refus de la candidature :", error);
      setError("Erreur lors du refus de la candidature");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/offer/getall");
        setOffres(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    }
    fetchData();
  }, []);

  const archiverCandidature = async (candidatureId, offerId) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/candidature/offer/${offerId}/candidature/${candidatureId}/archive`
      );
      console.log(response.data);
      alert("Candidature archivée avec succès");
      // Mettre à jour l'état local pour exclure la candidature archivée
      setCandidaturesParOffre((prevState) => {
        const updatedCandidatures = { ...prevState };
        updatedCandidatures[offerId] = updatedCandidatures[offerId].filter(
          (candidature) => candidature._id !== candidatureId
        );
        return updatedCandidatures;
      });
    } catch (error) {
      console.error("Erreur lors de l'archivage de la candidature :", error);
      setError("Erreur lors de l'archivage de la candidature");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchCandidatures() {
      try {
        const candidaturesMap = {};
        for (const offre of offres) {
          const response = await axios.get(
            `http://localhost:5000/candidature/candidatures/${offre._id}`
          );
          // Filtrer les candidatures archivées
          candidaturesMap[offre._id] = response.data.filter(
            (candidature) => candidature.status !== "archived"
          );
        }
        setCandidaturesParOffre(candidaturesMap);
      } catch (error) {
        console.error("Error fetching candidatures:", error);
      }
    }
    fetchCandidatures();
  }, [offres]);

  const handleViewArchivedCandidatures = async () => {
    try {
      const response = await axios.get("http://localhost:5000/candidature/archived");
      setArchivedCandidatures(response.data);
    } catch (error) {
      console.error("Error fetching archived candidatures:", error);
    }
  };

  const desarchiverCandidature = async (candidatureId, offerId) => {
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        `http://localhost:5000/candidature/${candidatureId}/unarchive`
      );
      console.log(response.data);
      alert("Candidature désarchivée avec succès");
      
      // Mettre à jour l'état local pour refléter le changement de statut
      setCandidaturesParOffre((prevState) => {
        const updatedCandidatures = { ...prevState };
        // Vérifier si updatedCandidatures[offerId] est défini avant de mapper dessus
        if (updatedCandidatures[offerId]) {
          updatedCandidatures[offerId] = updatedCandidatures[offerId].map(
            (candidature) => {
              if (candidature._id === candidatureId) {
                return { ...candidature, status: 'pending' }; // Mettre à jour le statut à 'pending' ou autre statut approprié
              }
              return candidature;
            }
          );
        }
        return updatedCandidatures;
      });
    } catch (error) {
      console.error("Erreur lors du désarchivage de la candidature :", error);
      setError("Erreur lors du désarchivage de la candidature");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPDF = () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    
    // Concatenate all candidature arrays into a single array
    const allCandidatures = Object.values(candidaturesParOffre).flat();
    
    const htmlContent = `
      <html>
        <head>
          <title>Candidature List</title>
        </head>
        <body>
          <table style=${tableStyles}>
            <thead>
              <tr>
                <th style=${headerStyles}>Nom</th>
                <th style=${headerStyles}>Email</th>
                <th style=${headerStyles}>Specialite</th>
                <th style=${headerStyles}>Status</th>
              </tr>
            </thead>
            <tbody>
              ${allCandidatures.map(candidature => {
                return `
                  <tr>
                    <td style=${cellStyles}>${candidature.nom}</td>
                    <td style=${cellStyles}>${candidature.email}</td>
                    <td style=${cellStyles}>${candidature.specialite}</td>
                    <td style=${cellStyles}>${candidature.status}</td>
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </body>
      </html>`;
    
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(htmlContent);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow.print();
    }, 1000);
  };
  


  // Calcul du nombre total de pages
  const totalPages = Math.ceil(offres.length / itemsPerPage);

  // Fonction pour afficher la page suivante
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Fonction pour afficher la page précédente
  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Index de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <DashboardLayout>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        mt={-3}
        p={2}
        mb={3}
        textAlign="center"
      >
        <Typography variant="h2" style={{ color: "white" }}>
          Liste des Candidatures
        </Typography>
      </MDBox>
      <MDBox>
        <MDButton    variant="gradient"
          color="secondary" component={Link}
          to="/archives">
          Voir l'archive
        </MDButton>
        <MDButton    variant="gradient"
          color="secondary" component={Link}
          to="/accept">
          Voir les acceptées
        </MDButton>
        <MDButton
                variant="gradient"
                color="secondary"
                component={Link}
                to="/statistics"
              >
                Voir statistiques
              </MDButton>
               <MDButton variant="gradient" color="secondary" onClick={handleDownloadPDF}>
          Télécharger en PDF
        </MDButton>
      </MDBox>
      <Box sx={{ padding: "20px" }}>
        {offres.slice(indexOfFirstItem, indexOfLastItem).map((offre) => (
          <StyledContainer key={offre._id} component={Paper}>
            <Box
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h8" gutterBottom>
                {offre.title}
              </Typography>
            </Box>
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
                {candidaturesParOffre[offre._id] &&
                  candidaturesParOffre[offre._id].map((candidature, index) => (
                    <TableRow key={candidature._id} style={index % 2 === 0 ? evenRowStyles : {}}>
                      <TableCell style={cellStyles}>{candidature.nom}</TableCell>
                      <TableCell style={cellStyles}>{candidature.email}</TableCell>
                      <TableCell style={cellStyles}>{candidature.specialite}</TableCell>
                      <TableCell style={cellStyles}>
                        <a href={`http://localhost:5000/${candidature.cv}`} target="_blank" rel="noopener noreferrer">
                          Voir CV
                        </a>
                      </TableCell>
                      <TableCell style={cellStyles}>
                        <a href={`http://localhost:5000/${candidature.lettreMotivation}`} target="_blank" rel="noopener noreferrer">
                          Voir Lettre de Motivation
                        </a>
                      </TableCell>
                      <TableCell sx={cellStyles}>{candidature.status}</TableCell>
                      <TableCell style={cellStyles}>
                        <Button onClick={() => accepterCandidature(candidature._id, candidature.offerId)} disabled={loading}>
                          {loading ? "En cours..." : "Accepter"}
                        </Button>
                        <Button onClick={() => refuserCandidature(candidature._id, candidature.offerId)} disabled={loading}>
                          {loading ? "En cours..." : "Refuser"}
                        </Button>
                        <Button onClick={() => archiverCandidature(candidature._id, offre._id)} disabled={loading}>
                          {loading ? "En cours..." : "Archiver"}
                        </Button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </table>
          </StyledContainer>
        ))}
      </Box>

   
      {/* Pagination */}
      <MDBox display="flex" justifyContent="center" mt={3}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={prevPage}
          disabled={currentPage === 1} // Désactiver le bouton s'il n'y a pas de page précédente
          style={{ marginRight: "10px" }}
        >
          Page Précédente
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          onClick={nextPage}
          disabled={currentPage === totalPages} // Désactiver le bouton s'il n'y a pas de page suivante
          style={{ marginLeft: "10px" }}
        >
          Page Suivante
        </MDButton>
      </MDBox>
      <Footer/>
    </DashboardLayout>
  );
}

export default CandidatureList;