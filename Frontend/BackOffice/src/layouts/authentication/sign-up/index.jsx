/* eslint-disable */
import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpg";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import API_URLS from "../../../apiUrls";
import ReCAPTCHA from "react-google-recaptcha";
function Cover() {
  const roles = ["Student", "Teacher", "Alumni", "Admin", "Subadmin", "Company"]; // List of roles
const [capVal,setCapVal] = useState(null)
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
    role: "" // Initialize role as an empty string
  });

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
      [`${name}Error`]: errorMessage // Store error message in state
    });
  };

  const handleRoleChange = (event, newValue) => {
    setFormData({
      ...formData,
      role: newValue // Update role value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch(API_URLS.addUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle successful submission
        console.log("User added successfully!");
      } else {
        // Handle error
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Failed to add user", error);
    }
  };


  return (
    <CoverLayout image={bgImage}>
      <Card>
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
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="firstname"
                label="First Name"
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
                label="Last Name"
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
                label="Password"
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
                label="Confirm Password"
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
                Sign up
              </MDButton>
            </MDBox>
          </MDBox>

        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;