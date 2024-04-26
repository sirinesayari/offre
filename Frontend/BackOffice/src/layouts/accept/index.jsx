/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Box, Typography, Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { Link } from "react-router-dom";
const AcceptedCandidatures = () => {
    const [acceptedCandidatures, setAcceptedCandidatures] = useState([]);
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
        const fetchAcceptedCandidatures = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get("http://localhost:5000/candidature/accepted");
                setAcceptedCandidatures(response.data);
            } catch (error) {
                console.error("Error fetching accepted candidatures:", error);
                setError("Error fetching accepted candidatures");
            } finally {
                setLoading(false);
            }
        };

        fetchAcceptedCandidatures();
    }, []);

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
                        Candidatures acceptées
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
                                <th style={headerStyles}>Action</th>
                            </tr>
                        </thead>
                        <TableBody>
                            {acceptedCandidatures.map((candidature) => (
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
                                    <Link to="/calendrier">
                                        <Button>
                                            Entretien
                                        </Button>
                                    </Link>
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
            <Footer />
        </DashboardLayout>
    );
};

export default AcceptedCandidatures;