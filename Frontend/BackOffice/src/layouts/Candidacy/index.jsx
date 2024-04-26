/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { Card, Typography, Box, Container, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Candidacy() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [lettreMotivation, setLettreMotivation] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [offres, setOffres] = useState([]); // État pour stocker les offres disponibles
  const [offreSelectionnee, setOffreSelectionnee] = useState(""); // État pour stocker l'ID de l'offre sélectionnée

  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offer/getall");
      setOffres(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleCvChange = (e) => {
    setCv(e.target.files[0]);
  };

  const handleLettreMotivationChange = (e) => {
    setLettreMotivation(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("email", email);
      formData.append("specialite", specialite);
      formData.append("lettreMotivation", lettreMotivation);
      formData.append("cv", cv);
      formData.append("offreId", offreSelectionnee); // Ajouter l'ID de l'offre sélectionnée

      const response = await axios.post("http://localhost:5000/candidature/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setLoading(false);
      alert("Candidature ajoutée avec succès!");
    } catch (error) {
      console.error("Error adding candidature:", error);
      setLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Failed to add candidature. Please try again.");
      }
    }
  };

  return (
    <DashboardLayout>
                <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={15}
            mt={0.1}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Postuler 
            </MDTypography>
          </MDBox>
      <Container>
        <Card sx={{ mt: 4, mx: "auto", maxWidth: 900, p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="text"
                  label="Nom"
                  fullWidth
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  type="text"
                  label="Spécialité"
                  fullWidth
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="cv" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Upload Curriculum Vitae</label>
                <input
                  id="cv"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleCvChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="lettreMotivation" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Upload Lettre de Motivation</label>
                <input
                  id="lettreMotivation"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleLettreMotivationChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="offreSelectionnee" style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Sélectionner l'offre</label>
                <select
                  id="offreSelectionnee"
                  onChange={(e) => setOffreSelectionnee(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                >
                  <option value="">Sélectionnez une offre</option>
                  {offres.map((offre) => (
                    <option key={offre._id} value={offre._id}>{offre.title}</option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Box mt={2}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Envoi en cours..." : "Ajouter Candidature"}
                  </MDButton>
                  <MDButton
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/tables"
                    sx={{ ml: 2 }}
                  >
                    Retour à la liste des candidatures
                  </MDButton>
                </Box>
              </Grid>
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    {errorMessage}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </form>
        </Card>
      </Container>
      <span>
        <tr></tr>
      </span>
      <Footer />
    </DashboardLayout>
  );
}

export default Candidacy;
