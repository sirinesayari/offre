/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import { MenuItem , Checkbox, FormControlLabel } from "@mui/material";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


function Modifier() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    location: "",
    salary: 0,
    experienceLevel: "",
    offerType: "",
    publicationDate: "",
    expirationDate: "",
    contractType: "",
    internshipDuration: "",
    file: "",
    quiz: "", // Ajout du champ "quiz"
    errors: {},
  });

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/offer/get/${id}`);
        const offerData = response.data;
        setQuiz(offerData.quiz || false);

        // Formatter la date d'expiration pour correspondre au format 'YYYY-MM-DD'
      const formattedExpirationDate = offerData.expirationDate.split("T")[0];
      const fileField = offerData.filePath; // Remplacez "filePath" par le nom correct du champ de fichier dans la base de données


        setFormData({
          title: offerData.title,
          description: offerData.description,
          skills: offerData.skills,
          location: offerData.location,
          salary: offerData.salary,
          experienceLevel: offerData.experienceLevel,
          offerType: offerData.offerType || "",
          publicationDate: offerData.publicationDate,
          expirationDate: formattedExpirationDate,
          contractType: offerData.contractType,
          internshipDuration: offerData.internshipDuration,
          file: fileField, // Utilisez le nom correct du champ de fichier dans la base de données
          quiz: offerData.quiz || "", // Récupération du champ "quiz"
          errors: {},
        });
      } catch (error) {
        console.error("Error fetching the offer:", error);
      }
    };

    fetchOffer();
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Utiliser "file" comme clé
      formData.append("id", id);
      axios.put("http://localhost:5000/offer/uploadFile/${offerId}", formData)
        .then(response => {
          console.log(response.data);
          // Mettre à jour le state ou effectuer d'autres actions si nécessaire
          // Mettre à jour le champ "Fichier" dans le formulaire
          setFormData((prevFormData) => ({
            ...prevFormData,
            file: response.data.filePath || "", // Assurez-vous que la valeur n'est pas undefined
          }));
        })
        .catch(error => {
          console.error("Error uploading file:", error);
        });
    }
  };
  
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Ajouter une validation spécifique pour la date d'expiration
    if (name === "expirationDate") {
      // Vérifier si la date d'expiration est inférieure ou égale à la date de publication
      const publicationDate = new Date(formData.publicationDate);
      const expirationDate = new Date(value);
  
      if (expirationDate <= publicationDate) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: {
            ...prevFormData.errors,
            expirationDate: "La date d'expiration doit être postérieure à la date de publication.",
          },
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: {
            ...prevFormData.errors,
            expirationDate: "", // Effacer l'erreur si la date est valide
          },
        }));
      }
    }
  

    // Ajouter une validation spécifique pour le champ de salaire
    if (name === "salary") {
      // Vérifier si la valeur est un nombre positif
      const isPositiveNumber = /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

      if (!isPositiveNumber) {
        // Si ce n'est pas un nombre positif, afficher une erreur
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: {
            ...prevFormData.errors,
            [name]: "Le salaire doit être un nombre positif.",
          },
        }));
      } else {
        // Si c'est un nombre positif, effacer l'erreur et mettre à jour la valeur
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          errors: {
            ...prevFormData.errors,
            [name]: "", // Effacer l'erreur
          },
        }));
      }
    } else {
      // Pour les autres champs, mettre à jour le formulaire normalement
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const [isFormDirty, setIsFormDirty] = useState(false);
  const getErrorMessage = (fieldName) => {
    return formData.errors[fieldName] ? `${fieldName} est un champ obligatoire` : "";
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation check before submitting
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        publicationDate: formattedDate,
      }));
  // Check if expiration date is before or equal to publication date
  const publicationDate = new Date(formData.publicationDate);
  const expirationDate = new Date(formData.expirationDate);

  if (expirationDate <= publicationDate) {
    throw new Error("La date d'expiration doit être postérieure à la date de publication.");
  }
      const errors = {};
      const requiredFields = [
        "title",
        "description",
        "skills",
        "offerType",
        "publicationDate",
        "expirationDate",
      ];

      let isFormValid = true;

      requiredFields.forEach((field) => {
        if (formData[field] === "") {
          errors[field] = "Ce champ est obligatoire";
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: errors,
        }));
        return;
      }


      const response = await axios.put(`http://localhost:5000/offer/updateOffer/${id}`, formData);
      console.log(response.data);
      window.alert("Offre modifiée avec succès!");
    } catch (error) {
      console.error("Error submitting the form:", error);
      setFormData((prevFormData) => ({
        ...prevFormData,
        errors: {
          ...prevFormData.errors,
          expirationDate: error.message,
        }
      }));
    }
  };

  const isStageOffer = formData.offerType === "stage";
  const isEmploiOffer = formData.offerType === "emploi";
  const [selectedOption, setSelectedOption] = useState("");
  const [quiz, setQuiz] = useState(formData.quiz || false);
// Définissez une fonction pour gérer les changements de valeur du champ de quiz
const handleQuizChange = (event) => {
  const { checked } = event.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    quiz: checked, // Mettre à jour l'état du champ quiz dans formData
  }));
  setQuiz(checked); // Mettre à jour l'état du champ quiz séparément
};

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value); // Mettre à jour l'option sélectionnée

    // Mettre à jour le formulaire en fonction du type d'offre sélectionné
    setFormData((prevFormData) => ({
      ...prevFormData,
      offerType: value, // Mettre à jour le type d'offre
      contractType: value === "stage" ? "stage" : "", // Limiter le type de contrat à "stage" si c'est un stage
    }));
  };
  return (
    <DashboardLayout>
       <DashboardNavbar />
      <MDBox mt={8}> {/* Remove top margin */}
        <MDBox mb={2} className="graph-container"> {/* Remove bottom margin */}
      <MDBox mb={2} />
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
              Modifier votre offre d&rdquo;emploi
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <form onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Titre"
                  variant="standard"
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={Boolean(formData.errors.title)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.title}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="textarea"
                  label="Description *"
                  variant="standard"
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(formData.errors.description)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.description}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Compétences"
                  variant="standard"
                  fullWidth
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  error={Boolean(formData.errors.skills)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.skills}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Lieu"
                  variant="standard"
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={Boolean(formData.errors.location)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.location}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="Salaire"
                  variant="standard"
                 
                  fullWidth
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  error={Boolean(formData.errors.salary)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.salary}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Niveau d'expérience"
                  variant="standard"
                  fullWidth
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  error={Boolean(formData.errors.experienceLevel)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.experienceLevel}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Date de publication"
                  variant="standard"
                  fullWidth
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  error={Boolean(formData.errors.publicationDate)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.publicationDate}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Date d'expiration"
                  variant="standard"
                  fullWidth
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  error={Boolean(formData.errors.expirationDate)}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.expirationDate}
                </MDTypography>
              </MDBox>
              <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Type d'offre *"
                    variant="standard"
                    fullWidth
                    select
                    name="offerType"
                    value={formData.offerType}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      handleOptionChange(e); // Appeler la fonction handleOptionChange pour mettre à jour le type d'offre
                      if (e.target.value) {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          errors: {
                            ...prevFormData.errors,
                            offerType: "", // Effacer le message d'erreur si le champ est rempli
                          },
                        }));
                      }
                    }}
                    onBlur={() => {
                      setIsFormDirty(true);
                      if (!formData.offerType) {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          errors: {
                            ...prevFormData.errors,
                            offerType: "Ce champ est obligatoire",
                          },
                        }));
                      }
                    }}
                    error={Boolean(isFormDirty && formData.errors.offerType)}
                  >
                    <MenuItem value="emploi">Emploi</MenuItem>
                    <MenuItem value="stage">Stage</MenuItem>
                  </MDInput>
                  <MDTypography variant="caption" color="error">
                    {getErrorMessage("offerType")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={2}>
                <MDInput
  type="text"
  label="Type de contrat"
  variant="standard"
  fullWidth
  select
  name="contractType"
  value={formData.contractType}
  onChange={handleChange}
>
  {selectedOption === "stage" ? (
    // Si c'est un stage, afficher uniquement l'option "stage"
    [<MenuItem key="stage" value="stage">Stage</MenuItem>]
  ) : (
    // Si c'est un emploi, afficher toutes les options
    [
      <MenuItem key="CDI" value="CDI">CDI</MenuItem>,
      <MenuItem key="CDD" value="CDD">CDD</MenuItem>,
      <MenuItem key="freelance" value="freelance">Freelance</MenuItem>,
    ]
  )}
</MDInput>
                </MDBox>
                {formData.contractType === "stage" && (
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Durée du stage"
                      variant="standard"
                      fullWidth
                      name="internshipDuration"
                      value={formData.internshipDuration}
                      onChange={handleChange}
                      error={Boolean(formData.errors.internshipDuration)}
                    />
                    <MDTypography variant="caption" color="error">
                      {getErrorMessage("internshipDuration")}
                    </MDTypography>
                  </MDBox>
                )}
              <MDBox mb={2}>
                <MDInput
                  type="file"
                  label="Image"
                  variant="standard"
                  fullWidth
                  name="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
                onChange={handleFileChange}
                />
                <MDTypography variant="caption" color="error">
                  {formData.errors.file}
                </MDTypography>
              </MDBox>
              <MDBox component="form">
              <FormControlLabel
                control={
                    <Checkbox
                      checked={formData.quiz}
                      onChange={handleQuizChange}
                      name="quiz"
                      color="primary"
                    />
                  }
                  label="Voulez-vous ajouter un test de quiz ?"
                />
                 </MDBox>
              {formData.quiz ? (
                <MDTypography variant="body1" color="textPrimary">
                  Test de quiz sera ajouté.
                </MDTypography>
              ) : (
                <MDTypography variant="body1" color="textPrimary">
                  Pas de test de quiz sera ajouté.
                </MDTypography>
              )}
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  Modifier Offre
                </MDButton>
                </MDBox>
                <Link to="/offerManagement">
            <MDButton Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} >
            Retour
          </MDButton>
        </Link>
              
            </form>
          </MDBox>
        </Card>
      <Footer />
      </MDBox> </MDBox>
    </DashboardLayout>
  );
}

export default Modifier;
