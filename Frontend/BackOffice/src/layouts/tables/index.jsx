import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import {
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";

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

const buttonContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "10px",
};

const buttonStyles = {
  cursor: "pointer",
  marginRight: "5px",
};

const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  border: "2px solid #000",
  padding: "20px",
};

function CandidatureList() {
  const [offres, setOffres] = useState([]);
  const [candidaturesParOffre, setCandidaturesParOffre] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

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

  useEffect(() => {
    async function fetchCandidatures() {
      try {
        const candidaturesMap = {};
        for (const offre of offres) {
          const response = await axios.get(
            `http://localhost:5000/candidature/candidatures/${offre._id}`
          );
          candidaturesMap[offre._id] = response.data;
        }
        setCandidaturesParOffre(candidaturesMap);
      } catch (error) {
        console.error("Error fetching candidatures:", error);
      }
    }
    fetchCandidatures();
  }, [offres]);

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
        p={3}
        mb={1}
        textAlign="center"
      >
        <Typography variant="h2" style={{ color: "white" }}>
          Liste des Candidatures par Offre
        </Typography>
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
                    </TableRow>
                  ))}
              </TableBody>
            </table>
          </StyledContainer>
        ))}
      </Box>

      {/* Pagination */}
      <MDBox display
="flex" justifyContent="center" mt={3}>
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
</DashboardLayout>
);
}

export default CandidatureList;
