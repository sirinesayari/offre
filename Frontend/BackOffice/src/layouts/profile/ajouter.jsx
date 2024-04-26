/*eslint-disable*/import React, { useState , useRef  } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import { Select, MenuItem, InputLabel ,TextField , Checkbox, FormControlLabel} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MDBox from "components/MDBox";
import Autocomplete from "@mui/material/Autocomplete";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


function Ajouter() {
  const [selectedOption, setSelectedOption] = useState("");
  const [SelectedCountries, setSelectedCountries] = useState([]);
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    location: "",
    salary: "",
    experienceLevel: "",
    offerType: "",
    publicationDate: "",
    expirationDate: "",
    file: "",
    contractType: "",
    internshipDuration: "",
    quiz: false, 
    errors: {},
  });
  const handleCountriesChange = (event, newCountries) => {
    setSelectedCountries(newCountries);
    setFormData({
      ...formData,
      location: newCountries.join(", "),
    });
  };

  const skillsOptions = [
    // Programming Languages and Technologies
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "C++",
    "C#",
    "SQL",
    "Angular",
    "Vue.js",
    "TypeScript",
    "PHP",
    "ASP.NET",
    "Ruby",
    "Swift",
    "Objective-C",
    "Kotlin",
    "Django",
    "Flask",
    "Spring",
    "Hibernate",
    "jQuery",
    "Bootstrap",
    "Sass",
    "Less",
    "TensorFlow",
    "PyTorch",
    "Keras",
    // Artisan Skills
    "Woodworking",
    "Metalworking",
    "Pottery",
    "Glassblowing",
    "Sculpting",
    "Painting",
    "Drawing",
    "Calligraphy",
    "Jewelry Making",
    "Knitting",
    "Crocheting",
    // Computer Science Skills
    "Data Structures",
    "Algorithms",
    "Software Engineering",
    "Networking",
    "Cybersecurity",
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Big Data",
    "Data Science",
    "Data Analysis",
    "Data Visualization",
    "Blockchain",
    "Cloud Computing",
    "DevOps",
    "Web Development",
    "Mobile App Development",
    // Healthcare Skills
    "Medical Terminology",
    "Patient Care",
    "Medical Coding",
    "Nursing",
    "Pharmacy",
    "Medical Imaging",
    "Health Informatics",
    "Physical Therapy",
    "Occupational Therapy",
    "Speech Therapy",
    "Emergency Medicine",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    // Add more skills as needed
  ];

  const countryOptions = [
    "États-Unis",
    "Royaume-Uni",
    "Canada",
    "Australie",
    "Afghanistan",
    "Albanie",
    "Algérie",
    "Andorre",
    "Angola",
    "Antigua-et-Barbuda",
    "Argentine",
    "Arménie",
    "Autriche",
    "Azerbaïdjan",
    "Bahamas",
    "Bahreïn",
    "Bangladesh",
    "Barbade",
    "Biélorussie",
    "Belgique",
    "Belize",
    "Bénin",
    "Bhoutan",
    "Bolivie",
    "Bosnie-Herzégovine",
    "Botswana",
    "Brésil",
    "Brunei",
    "Bulgarie",
    "Burkina Faso",
    "Burundi",
    "Cap-Vert",
    "Cambodge",
    "Cameroun",
    "République centrafricaine",
    "Tchad",
    "Chili",
    "Chine",
    "Colombie",
    "Comores",
    "République démocratique du Congo",
    "République du Congo",
    "Costa Rica",
    "Croatie",
    "Cuba",
    "Chypre",
    "République tchèque",
    "Danemark",
    "Djibouti",
    "Dominique",
    "République dominicaine",
    "Timor oriental",
    "Équateur",
    "Égypte",
    "Salvador",
    "Guinée équatoriale",
    "Érythrée",
    "Estonie",
    "Eswatini",
    "Éthiopie",
    "Fidji",
    "Finlande",
    "France",
    "Gabon",
    "Gambie",
    "Géorgie",
    "Allemagne",
    "Ghana",
    "Grèce",
    "Grenade",
    "Guatemala",
    "Guinée",
    "Guinée-Bissau",
    "Guyane",
    "Haïti",
    "Honduras",
    "Hongrie",
    "Islande",
    "Inde",
    "Indonésie",
    "Iran",
    "Iraq",
    "Irlande",
    "Israël",
    "Italie",
    "Jamaïque",
    "Japon",
    "Jordanie",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Corée du Nord",
    "Corée du Sud",
    "Kosovo",
    "Koweït",
    "Kirghizistan",
    "Laos",
    "Lettonie",
    "Liban",
    "Lesotho",
    "Libéria",
    "Libye",
    "Liechtenstein",
    "Lituanie",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaisie",
    "Maldives",
    "Mali",
    "Malte",
    "Îles Marshall",
    "Mauritanie",
    "Maurice",
    "Mexique",
    "Micronésie",
    "Moldavie",
    "Monaco",
    "Mongolie",
    "Monténégro",
    "Maroc",
    "Mozambique",
    "Myanmar (Birmanie)",
    "Namibie",
    "Nauru",
    "Népal",
    "Pays-Bas",
    "Nouvelle-Zélande",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Macédoine du Nord",
    "Norvège",
    "Oman",
    "Pakistan",
    "Palaos",
    "Palestine",
    "Panama",
    "Papouasie-Nouvelle-Guinée",
    "Paraguay",
    "Pérou",
    "Philippines",
    "Pologne",
    "Portugal",
    "Qatar",
    "Roumanie",
    "Russie",
    "Rwanda",
    "Saint-Christophe-et-Niévès",
    "Sainte-Lucie",
    "Saint-Vincent-et-les-Grenadines",
    "Samoa",
    "Saint-Marin",
    "Sao Tomé-et-Principe",
    "Arabie saoudite",
    "Sénégal",
    "Serbie",
    "Seychelles",
    "Sierra Leone",
    "Singapour",
    "Slovaquie",
    "Slovénie",
    "Îles Salomon",
    "Somalie",
    "Afrique du Sud",
    "Soudan du Sud",
    "Espagne",
    "Sri Lanka",
    "Soudan",
    "Suriname",
    "Suède",
    "Suisse",
    "Syrie",
    "Taïwan",
    "Tadjikistan",
    "Tanzanie",
    "Thaïlande",
    "Togo",
    "Tonga",
    "Trinité-et-Tobago",
    "Tunisie",
    "Turquie",
    "Turkménistan",
    "Tuvalu",
    "Ouganda",
    "Ukraine",
    "Émirats arabes unis",
    "Uruguay",
    "Ouzbékistan",
    "Vanuatu",
    "Cité du Vatican",
    "Venezuela",
    "Viêt Nam",
    "Yémen",
    "Zambie",
    "Zimbabwe"
  ];
  
  const [selectedSkills, setSelectedSkills] = useState([]);
  const handleSkillChange = (event) => {
    const selectedValues = Array.isArray(event.target.value) ? event.target.value : [event.target.value]; // Assurez-vous que selectedValues est toujours un tableau
    setSelectedSkills(selectedValues);
  
    // Mettre à jour le champ skills dans le formulaire
    setFormData((prevFormData) => ({
      ...prevFormData,
      skills: selectedValues.join(","), // Concaténer les compétences sélectionnées en une chaîne séparée par des virgules
      errors: {
        ...prevFormData.errors,
        skills: "", // Effacer l'erreur une fois que des compétences ont été sélectionnées
      },
    }));
  };
  
  
  const [imagePath, setImagePath] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const getErrorMessage = (fieldName) => {
    return formData.errors[fieldName] ? `${fieldName} est un champ obligatoire` : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    try {
      console.log("Form Data:", formData);
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
      const { name, value } = event.target;

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
  ;
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
      const response = await axios.post("http://localhost:5000/offer/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      });
      console.log(response.data);

      window.alert("Offre ajoutée avec succès!");
      // Optionally, you can redirect the user after successful submit
    }  catch (error) {
      console.error("Error submitting the form:", error);
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error("Server responded with error:", error.response.data);
        window.alert("Une erreur s'est produite lors de l'ajout de l'offre. Veuillez réessayer.");
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error("No response received from server.");
        window.alert("Aucune réponse du serveur. Veuillez réessayer.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Error setting up the request:", error.message);
        window.alert("Erreur lors de la configuration de la requête. Veuillez réessayer.");
      }
    
    
      // Handle the error appropriately
      setFormData((prevFormData) => ({
        ...prevFormData,
        errors: {
          ...prevFormData.errors,
          expirationDate: error.message,
        }
      }));
    }
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Ajouter une validation spécifique pour la date d'expiration
    if (name === "expirationDate") {
      // Vérifier si la date d'expiration est inférieure ou égale à la date de publication
      const publicationDate = new Date(formData.publicationDate);
      const expirationDate = new Date(value);
  
      if (expirationDate < publicationDate) {
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: file,
    }));
  };
  const [quiz, setQuiz] = useState(formData.quiz || false);
  // Définissez une fonction pour gérer les changements de valeur du champ de quiz
  const handleQuizChange = (event) => {
    const { checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      quiz: checked,
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
              Publiez votre offre emploi
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Titre *"
                  variant="standard"
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={(e) => {
                    setIsFormDirty(true);
                    handleChange(e); // Appeler la fonction handleChange pour mettre à jour les données du formulaire
                    if (e.target.value) {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        errors: {
                          ...prevFormData.errors,
                          title: "", // Effacer le message d'erreur si le champ est rempli
                        },
                      }));
                    }
                  }}
                  onBlur={() => {
                    setIsFormDirty(true);
                    if (!formData.title) {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        errors: {
                          ...prevFormData.errors,
                          title: "Ce champ est obligatoire",
                        },
                      }));
                    }
                  }}
                  error={Boolean(isFormDirty && formData.errors.title)}
                />
                <MDTypography variant="caption" color="error">
                  {getErrorMessage("title")}
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
                  onChange={(e) => {
                    setIsFormDirty(true);
                    handleChange(e); // Appeler la fonction handleChange pour mettre à jour les données du formulaire
                    if (e.target.value) {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        errors: {
                          ...prevFormData.errors,
                          description: "", // Effacer le message d'erreur si le champ est rempli
                        },
                      }));
                    }
                  }}
                  onBlur={() => {
                    setIsFormDirty(true);
                    if (!formData.description) {
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        errors: {
                          ...prevFormData.errors,
                          description: "Ce champ est obligatoire",
                        },
                      }));
                    }
                  }}
                  error={Boolean(isFormDirty && formData.errors.description)}
                />
                <MDTypography variant="caption" color="error">
                  {getErrorMessage("description")}
                </MDTypography>
              </MDBox>
                
              <MDBox mb={2}>
  <Autocomplete
    multiple
    options={skillsOptions}
    value={selectedSkills}
    onChange={(event, newValue) => {
      setSelectedSkills(newValue);
      // Mettre à jour le champ skills dans le formulaire avec les valeurs sélectionnées
      setFormData((prevFormData) => ({
        ...prevFormData,
        skills: newValue.join(","), // Concaténer les compétences sélectionnées en une chaîne séparée par des virgules
        errors: {
          ...prevFormData.errors,
          skills: "", // Effacer l'erreur une fois que des compétences ont été sélectionnées
        },
      }));
    }}
    onBlur={() => {
      setIsFormDirty(true);
      if (selectedSkills.length === 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          errors: {
            ...prevFormData.errors,
            skills: "Ce champ est obligatoire",
          },
        }));
      }
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Skills *"
        variant="standard"
        fullWidth
        error={Boolean(isFormDirty && formData.errors.skills)}
        helperText={isFormDirty && formData.errors.skills ? "Ce champ est obligatoire" : ""}
      />
    )}
  />
</MDBox>

                  <Autocomplete
                  multiple
                  options={countryOptions}
                  value={SelectedCountries}
                  onChange={handleCountriesChange}
                  renderInput={(params) => <TextField {...params} label="Lieu" />}
                />
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
                    {getErrorMessage("salary")}
                  </MDTypography>
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Niveau d'expérience "
                    variant="standard"
                    fullWidth
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    error={Boolean(formData.errors.experienceLevel)}
                  />
                  <MDTypography variant="caption" color="error">
                    {getErrorMessage("experienceLevel")}
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
  label="Type de contrat *"
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
                    type="date"
                    label="Date d'expiration *"
                    variant="standard"
                    fullWidth
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      handleChange(e); // Appeler la fonction handleChange pour mettre à jour la date d'expiration
                      if (e.target.value) {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          errors: {
                            ...prevFormData.errors,
                            expirationDate: "", // Effacer le message d'erreur si le champ est rempli
                          },
                        }));
                      }
                    }}
                    onBlur={() => {
                      setIsFormDirty(true);
                      if (!formData.expirationDate) {
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          errors: {
                            ...prevFormData.errors,
                            expirationDate: "Ce champ est obligatoire",
                          },
                        }));
                      }
                    }}
                    error={Boolean(isFormDirty && formData.errors.expirationDate)}
                  />
                  <MDTypography variant="caption" color="error">
                    {getErrorMessage("expirationDate")}
                  </MDTypography>
                </MDBox>

                <MDBox mb={2}>
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
<MDBox mb={2}>
  {formData.quiz ? (
    <MDTypography variant="body1" color="textPrimary">
      Test de quiz sera ajouté.
    </MDTypography>
  ) : (
    <MDTypography variant="body1" color="textPrimary">
      Pas de test de quiz sera ajouté.
    </MDTypography>
  )}
</MDBox>

                <MDBox mb={2}>
                  <MDInput
                    type="file"
                    label="Logo de l'entreprise"
                    variant="standard"
                    fullWidth
                    ref={inputRef}
                    name="file"
                    onChange={handleImageChange}
                    error={Boolean(formData.errors.file)}
                  />
                  <MDTypography variant="caption" color="error">
                    {getErrorMessage("file")}
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" color="info" fullWidth type="submit">
                    Ajouter Offre
                  </MDButton>
                </MDBox>
                <Link to="/offerManagement">
            <MDButton Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} >
            Retour
          </MDButton>
        </Link>
              </MDBox>
            </MDBox>
          </Card>
        <Footer />
        </MDBox> </MDBox>
      </DashboardLayout>
    );
  }
  
  export default Ajouter;
  