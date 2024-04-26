/* eslint-disable */
import Autocomplete from "@mui/lab/Autocomplete";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ImageIcon from "@mui/icons-material/Image";
import FileIcon from "@mui/icons-material/Description";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import API_URLS from "apiUrls";
import { Link } from "react-router-dom";

function Ajout() {
  const roles = ["Etudiant", "Professeure", "Alumni", "Admin", "Subadmin", "Entreprise"]; // List of roles
  const [capVal, setCapVal] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstnameError: "",
    lastnameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    role: "",
  });

  

	
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let errorMessage = "";
    if (name === "firstname" || name === "lastname") {
      if (/\d/.test(value)) {
        errorMessage = "Le prénom et le nom ne devraient pas contenir de chiffres";
      } else if (value.length <= 3) {
        errorMessage = "Le prénom et le nom doivent contenir plus de 3 caractères";
      }
    
    
    }else if (name === "email") {
      if (!/\S+@\S+\.\S{2,}/.test(value)) {
        errorMessage = "Format d'email invalide";
      } else {
        try {
          const emailExistsRes = await axios.post(API_URLS.checkEmail, { email: value });
          if (emailExistsRes.data.exists) {
            errorMessage = "Cet email est déjà utilisé. Veuillez en utiliser un autre.";
          }
        } catch (error) {
          if (error.response) {
            // Gérer les erreurs de réponse HTTP
            if (error.response.status === 409) {
              errorMessage = "Cet email est déjà utilisé. Veuillez en utiliser un autre.";
            } else {
              errorMessage = "Erreur lors de la vérification de l'existence de l'email.";
            }
          } else if (error.request) {
            // Gérer les erreurs de requête
            errorMessage = "Erreur de réseau. Veuillez vérifier votre connexion Internet.";
          } else {
            // Gérer les erreurs inattendues
            errorMessage = "Une erreur s'est produite lors de la vérification de l'email. Veuillez réessayer.";
          }
        }
      }
      
    } else if (name === "password") {
      if (!/(?=.*\d)(?=.*[a-zÀ-ÿ])(?=.*[A-ZÀ-Ÿ])(?=.*[!@#$%^&*]).{8,}/.test(value)) {
        errorMessage = "Au moins 8 caractères,un chiffre,une minuscule, une majuscule et un caractère spécial";
      }
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        errorMessage = "Les mots de passe ne correspondent pas";
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
      [`${name}Error`]: errorMessage,
    });
  };

  const handleRoleChange = (event, newValue) => {
    setFormData({
      ...formData,
      role: newValue || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URLS.signup, formData);
      setMsg(res.data.message); // Accéder directement à la propriété 'data' de la réponse
      window.alert('Inscription réussie !');

    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        setError(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        setError("Non autorisé : Veuillez vous reconnecter.");
      } else if (error.response && error.response.status === 404) {
        setError("Ressource non trouvée.");
      } else if (error.response && error.response.status === 503) {
        setError("Service indisponible. Veuillez réessayer plus tard.");
      } else if (error.request) {
        setError("Erreur réseau. Veuillez vérifier votre connexion internet.");
      } else {
        setError("Une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer plus tard.");
      }
      window.alert('Échec de l inscription. Veuillez réessayer.');

    }
  };

  
  
  return (

    <DashboardLayout>
                <DashboardNavbar />

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
          style={{ marginTop: "20px" }}
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Rejoignez-nous !!
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
          Entrez vos coordonnées pour vous inscrire
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="firstname"
                label="Prénom"
                variant="standard"
                fullWidth
                value={formData.firstname}
                onChange={handleChange}
              />
              {formData.firstnameError && (
                <MDTypography variant="body2" color="error" style={{ fontSize: "12px" }}>
                  {formData.firstnameError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="lastname"
                label="Nom"
                variant="standard"
                fullWidth
                value={formData.lastname}
                onChange={handleChange}
              />
              {formData.lastnameError && (
                <MDTypography variant="body2" color="error" style={{ fontSize: "12px" }}>
                  {formData.lastnameError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                name="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
              {formData.emailError && (
                <MDTypography variant="body2" color="error" style={{ fontSize: "12px" }}>
                  {formData.emailError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                name="password"
                label="Mot de passe"
                variant="standard"
                fullWidth
                value={formData.password}
                onChange={handleChange}
              />
              {formData.passwordError && (
                <MDTypography variant="body2" color="error" style={{ fontSize: "12px" }}>
                  {formData.passwordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                name="confirmPassword"
                label="Confirmer Votre Mot de passe"
                variant="standard"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formData.confirmPasswordError && (
                <MDTypography variant="body2" color="error" style={{ fontSize: "12px" }}>
                  {formData.confirmPasswordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={roles}
                    value={formData.role}
                    onChange={handleRoleChange}
                    renderInput={(params) => <TextField {...params} label="Role" />}
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <ReCAPTCHA
                sitekey="6LdXhYspAAAAABmF7uoESPX5wt57MZEsNAdWbC4h"
                onChange={(val) => setCapVal(val)}
              />
              <MDButton disabled={!capVal} type="submit" variant="gradient" color="info" fullWidth>
              Ajouter
              </MDButton>
            </MDBox>
          </form>
          <Link to="/userManagement">
          <MDButton Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} >

            Retour
          </MDButton>
        </Link>
        </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Ajout;
