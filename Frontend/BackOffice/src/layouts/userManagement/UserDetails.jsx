/* eslint-disable */
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import { isValid } from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import { Link, useParams } from "react-router-dom";
import Header from "./components/Header";
import MDButton from "components/MDButton";
import { PDFDocument, rgb } from "pdf-lib";
import API_URLS from "apiUrls";

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


// Définir la liste des langues

const languageOptions = [
  "Anglais",
  "Français",
  "Espagnol",
  "Allemand",
  "Chinois (mandarin)",
  "Hindi",
  "Arabe",
  "Bengali",
  "Portugais",
  "Russe",
  "Japonais",
  "Pendjabi",
  "Turc",
  "Coréen",
  "Italien",
  "Vietnamien",
  "Tamoul",
  "Ourdou",
  "Gujarati",
  "Polonais",
  "Persan",
  "Malayalam",
  "Télougou",
  "Thaï",
  "Javanais",
  "Kannada",
  "Birman",
  "Odia",
  "Soundanais",
  "Sindhi",
  "Roumain",
  "Néerlandais",
  "Grec",
  "Suédois",
  "Tchèque",
  "Danois",
  "Finnois",
  "Hongrois",
  "Norvégien",
  "Slovaque",
  "Bulgare",
  "Catalan",
  "Hébreu",
  "Indonésien",
  "Malais",
  "Swahili",
  "Ukrainien",
  "Lituanien",
  "Philippin",
  "Slovène",
  "Letton",
  "Estonien",
  "Islandais",
  "Yoruba",
  "Zoulou",
  "Marathi",
  "Suédois",
  "Tagalog",
  "Haoussa",
  "Serbe",
  "Albanais",
  "Azéri",
  "Igbo",
  "Amharique",
  "Persan",
  "Pachto",
  "Tadjik",
  "Somali",
  "Kurde",
  "Tigrinya",
  "Malgache",
  "Hmong",
  "Ouzbek",
  "Kinyarwanda",
  "Cinghalais",
  "Bhojpuri",
  "Turkmène",
  "Cebuano",
];

const initialExperienceOptions = [
  "Stage en entreprise",
  "Projet scolaire",
  "Formation en ligne",
  "Cours universitaire",
  "Projet personnel",
  "Volontariat",
  "Formation professionnelle",
];

const initialCertifOptions = [
  "Certificat de langue",
  "Certificat professionnel",
  "Certificat de formation en ligne",
  "Certificat de compétence",
  "Certificat de participation",
  "Certificat de secourisme",
  "Certificat de premier secours",
  "Certificat de sauveteur aquatique",
];



const initialEducationOptions = [
  "École Nationale d'Ingénieurs de Sousse",
  "École Nationale d'Ingénieurs de Bizerte",
  "École Nationale d'Ingénieurs de Monastir",
  "École Nationale d'Ingénieurs de Gabès",
  "Institut Supérieur de Biotechnologie de Monastir",
  "Institut Supérieur d'Informatique de Monastir",
  "Institut Supérieur des Arts Multimédia de la Manouba",
  "Institut Supérieur de Musique de Tunis",
  "Institut Supérieur d'Histoire du Mouvement National",
  "Institut Supérieur des Langues Appliquées et Informatique de Béja",
  "Institut Supérieur de Commerce et d'Administration des Entreprises de Nabeul",
  "Institut Supérieur de Gestion de Sousse",
  "Institut Supérieur de Gestion de Tunis",
  "Institut Supérieur de Gestion de Sfax",
  "Institut Supérieur de l'Éducation et de la Formation Continue de la Manouba",
  "Institut Supérieur des Sciences et Techniques du Sport de Tunis",
  "Institut Supérieur des Sciences Humaines de Tunis",
  "Institut Supérieur des Sciences et Technologies de l'Information et de la Communication de Tunis",
  "Institut Supérieur des Sciences Appliquées et de Technologie de Sousse",
  "Institut Supérieur des Sciences et des Technologies de l'Environnement de l'Ariana",
  "Institut Supérieur des Sciences et Technologies de l'Eau de Gabès",
  "Institut Supérieur des Sciences et Technologies de l'Environnement de Borj Cédria",
  "Institut Supérieur des Études Historiques de Tunis",
  "Institut Supérieur des Études Technologiques de Radès",
  "Institut Supérieur des Études Appliquées en Humanités de Zaghouan",
  "Institut Supérieur des Langues de Tunis"
];

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

function Overview() {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [SelectedCountries, setSelectedCountries] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedCertif, setSelectedCertif] = useState([]);

  const [EducationOptions, setEducationOptions] = useState([...initialEducationOptions]);
  const [experienceOptions, setExperienceOptions] = useState([...initialExperienceOptions]);
  const [CertifOptions, setCertifOptions] = useState([...initialCertifOptions]);

  const [openEducationDialog, setOpenEducationDialog] = useState(false); // New state for education dialog
  const [openCertifDialog, setOpenCertifDialog] = useState(false); // New state for education dialog

  const [openDialog, setOpenDialog] = useState(false);

  const [editingSection, setEditingSection] = useState(null);
  const [openExperienceDialog, setOpenExperienceDialog] = useState(false);

  const [selectedDateOfBirth, setSelectedDateOfBirth] = useState(null); // State for Date of Birth
  const [imageData, setImageData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Function to handle changes in Date of Birth
  const handleDateOfBirthChange = (date) => {
    setSelectedDateOfBirth(date);
    setFormData({
      ...formData,
      dateOfBirth: date, // Update the formData state with the selected date
    });
  };

  // // Créez une fonction pour ouvrir le dialogue de l'expérience
  // const handleOpenExperienceDialog = () => {
  //   setOpenExperienceDialog(true);
  // };

  // Créez un nouvel état pour stocker les options de l'expérience
  const [selectedExperience, setSelectedExperience] = useState([]);
  const handleAddEducation = () => {
    // Open a dialog or prompt for users to enter the new education option
    const newEducationOption = prompt("Enter the new education option:");
    if (newEducationOption) {
      // Add the new education option to the existing options
      const updatedEducationOptions = [...EducationOptions, newEducationOption];
      setEducationOptions(updatedEducationOptions);

      // Select the newly added education option
      setSelectedEducation([...selectedEducation, newEducationOption]);
    }
  };
  const handleAddCertif = () => {
    // Open a dialog or prompt for users to enter the new education option
    const newCertifOptions = prompt("Enter the new certificate option:");
    if (newCertifOptions) {
      // Add the new education option to the existing options
      const updatedCertifOptions = [...CertifOptions, newCertifOptions];
      setCertifOptions(updatedCertifOptions);

      // Select the newly added education option
      setSelectedCertif([...selectedCertif, newCertifOptions]);
    }
  };
  // Ajoutez une fonction pour gérer l'ajout d'une nouvelle option d'expérience
  const handleAddExperience = () => {
    const newExperienceOption = prompt("Enter the new experience option:");
    if (newExperienceOption) {
      const updatedExperienceOptions = [...experienceOptions, newExperienceOption];
      setExperienceOptions(updatedExperienceOptions);
      setSelectedExperience([...selectedExperience, newExperienceOption]);
    }
  };
  const handleAddSkills = () => {
    const newSkillsOption = prompt("Enter the new skills option:");
    if (newSkillsOption) {
      const updatedSkillsOptions = [...skillsOptions, newSkillsOption];
      setSelectedSkills(updatedSkillsOptions);
      setSelectedSkills([...selectedSkills, newSkillsOption]);
    }
  };

  const handleSkillsChange = (event, newSkills) => {
    setSelectedSkills(newSkills);
    setFormData({
      ...formData,
      skills: newSkills.join(", "),
    });
  };
  const handleEducationChange = (event, newEducation) => {
    setSelectedEducation(newEducation);
    setFormData({
      ...formData,
      formation: newEducation.join(", "),
    });
  };
  const handleCertifChange = (event, newCertif) => {
    setSelectedCertif(newCertif);
    setFormData({
      ...formData,
      certificates: newCertif.join(", "),
    });
  };


  const handleOpenDialog = (section) => {
    setEditingSection(section);
    setOpenDialog(true);
    // Pre-fill the dialog fields with existing data
    setFormData({
      ...formData,
      [section]: userInfo[section],
    });
  };



  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(API_URLS.updateUser(userId), formData);
      console.log(response.data);
      setOpenDialog(false);
      setOpenDialogCv(false);

      setUserInfo(formData);
      setOpenContactDialog(false);
      setOpenProfileDialog(false);
      setOpenEducationDialog(false); // Fermer le dialogue de l'éducation après la mise à jour
      setOpenCertifDialog(false); // Fermer le dialogue de l'éducation après la mise à jour
      setShowAlert(true); // Show the alert

      setOpenExperienceDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  const handleLanguagesChange = (event, newLanguages) => {
    setSelectedLanguages(newLanguages);
    setFormData({
      ...formData,
      languages: newLanguages.join(", "),
    });
  };

  const handleCountriesChange = (event, newCountries) => {
    setSelectedCountries(newCountries);
    setFormData({
      ...formData,
      country: newCountries.join(", "),
    });
  };


  const [userInfo, setUserInfo] = useState({});

  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const { userId } = useParams();
  const [openDialogCv, setOpenDialogCv] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dateOfBirth: "",
    country: "",
    phone: "",
    languages: "",
    description: "",
    experience: "",
    formation: "",
    skills: "",
    certificates: "",
    emailError: "",

    phoneError: "",

  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";
    if (name === "email") {
      if (!/\S+@\S+\.\S{2,}/.test(value)) {
        errorMessage = "Invalid email format";
      }
    } else if (name === "phone") {
      if (!/^\d{8}$/.test(value)) {
        errorMessage = "Phone must be 8 numbers";
      }
    }
    setFormData({
      ...formData,
      [name]: value,
      [`${name}Error`]: errorMessage,
    });
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(API_URLS.getUserById(userId));
        setUserInfo(response.data);
        // Pre-fill form data with user details
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);


  const handleOpenContactDialog = () => {
    setOpenContactDialog(true);
    setEditingSection("contact");
    // Pré-remplir les champs de la boîte de dialogue avec les données de contact
    setFormData({
      ...formData,
      phone: userInfo.phone,
      email: userInfo.email
    });
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
    setEditingSection("profile");
    // Pré-remplir les champs de la boîte de dialogue avec les données de profil
    setFormData({
      ...formData,
      dateOfBirth: userInfo.dateOfBirth,
      country: userInfo.country,
      languages: userInfo.languages
    });
  };
  // Ajoutez une fonction pour gérer les changements dans les options de l'expérience
  const handleOpenExperienceChange = (event, newExperience) => {
    setSelectedExperience(newExperience);
    setFormData({
      ...formData,
      experience: newExperience.join(", "), // Mettre à jour l'état formData avec les options sélectionnées
    });
  };

  const handleCloseDialog = () => {
    setOpenContactDialog(false);
    setOpenProfileDialog(false);
    setEditingSection(null);
    setOpenDialog(false);

  };




  const handleFileChange = (event) => {
    // Récupérer le fichier téléchargé
    const file = event.target.files[0];
    // Lire le contenu du fichier en tant que données binaires
    const reader = new FileReader();
    reader.onloadend = () => {
      // Stocker les données de l'image
      setImageData(reader.result);
    };
    // Lire le contenu du fichier en tant que données binaires
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = event.target.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formData.append('cV', file);

      try {
        const response = await axios.put(API_URLS.uploadCV(userId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
        // Update state with the uploaded image data
        setImageData(response.data.imageUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('No file selected');
    }
  };
  const handleUploadAndClose = () => {
    handleUpdateUser(); // Appel de la fonction pour mettre à jour l'utilisateur
    setOpenDialogCv(false); // Fermer la boîte de dialogue d'envoi de CV
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        {userInfo && (
          <>
          {showAlert && (
  <Alert severity="success" onClose={() => setShowAlert(false)}>
    User details updated successfully!
  </Alert>
)}
            <div style={containerStyle}>
              <div style={columnStyle}>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>
                    Contact
                    <EditIcon style={editIconStyle} color="primary" onClick={handleOpenContactDialog} />
                  </h3>
                  <div style={contactContainer}>
                    <p><strong>Téléphone:</strong> <span style={textStyle}>{userInfo.phone}</span></p>
                  </div>
                  <div style={contactContainer}>
                    <p><strong>Email:</strong> <span style={textStyle}>{userInfo.email}</span></p>
                  </div>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Profile Information
                    <EditIcon style={editIconStyle} color="primary" onClick={handleOpenProfileDialog} />
                  </h3>
                  <div style={contactContainer}>
                    <p><strong>Date de naissance:</strong> <span style={textStyle}>{userInfo.dateOfBirth}</span></p>
                  </div>
                  <div style={contactContainer}>
                    <p><strong>Pays:</strong> <span style={textStyle}>{userInfo.country}</span></p>
                  </div>
                  <div style={contactContainer}>
                    <p><strong>Langues:</strong> <span style={textStyle}>{userInfo.languages}</span></p>
                  </div>
                  
                </div>
                <div>
                  <h2>Mon CV</h2>
                  
                  <img src={userInfo.cV} alt="Uploaded" onClick={() => setOpenDialogCv(true)} />

                </div>
              </div>

              <div style={columnStyle}>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>À propos
                    <EditIcon color="primary" onClick={() => handleOpenDialog("description")} />
                  </h3>
                  <div style={contactContainer}>
                    <p style={textStyle}>{userInfo.description}</p>
                  </div>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Éxperience
                    <EditIcon color="primary" onClick={() => setOpenExperienceDialog(true)} />
                  </h3>
                  <div style={contactContainer}>

                    <p style={textStyle}>{userInfo.experience}</p>

                  </div>
                </div>

                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Éducation
                    <EditIcon color="primary" onClick={() => setOpenEducationDialog(true)} />
                  </h3>
                  <div style={contactContainer}>
                    <p style={textStyle}>{userInfo.formation}</p>
                  </div>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Compétences
                    <EditIcon color="primary" onClick={() => handleOpenDialog("skills")} />
                  </h3>
                  <div style={contactContainer}>
                    <p style={textStyle}>{userInfo.skills}</p>

                  </div>
                </div>

                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Certificats
                    <EditIcon color="primary" onClick={() => setOpenCertifDialog(true)} />
                  </h3>
                  <div style={contactContainer}>

                    <p style={textStyle}>{userInfo.certificates}</p>
                  </div>

                </div>
                
              </div>
             
            </div>
            <Link to="/userManagement">
            <MDButton Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} >
            Retour
          </MDButton>
        </Link>
            {/* Dialogue pour modifier les informations de contact */}
            {/* Dialog for editing sections */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Modifier {editingSection}</DialogTitle>
              <DialogContent>
                {editingSection === "skills" && (
                  <Autocomplete
                    multiple
                    options={skillsOptions}
                    value={selectedSkills}
                    onChange={handleSkillsChange}
                    renderInput={(params) => <TextField {...params} label="Compétences" />}
                  />


                )}
                {editingSection !== "skills" && (
                  <TextField
                    name={editingSection}
                    label={editingSection}
                    value={formData[editingSection]}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />

                )}
                <Button onClick={handleAddSkills}>Ajouter </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
              </DialogActions>
            </Dialog>

            {/* Dialogue pour modifier les informations de contact */}
            <Dialog open={openContactDialog} onClose={handleCloseDialog}>
              <DialogTitle>Modify Contact Information</DialogTitle>
              <DialogContent>
                <TextField
                  name="phone"
                  label="Téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                {formData.phoneError && (
                  <p style={{ color: "red" }}>{formData.phoneError}</p>
                )}
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />{formData.emailError && (
                  <p style={{ color: "red" }}>{formData.emailError}</p>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary" disabled={!isValid}>Enregistrer</Button>
              </DialogActions>
            </Dialog>

            {/* Dialogue pour modifier les informations de profil */}
            <Dialog open={openProfileDialog} onClose={handleCloseDialog}>
              <DialogTitle>Modify Profile Information</DialogTitle>
              <DialogContent>
                <TextField
                  type="date"
                  label="Date de naissance"
                  value={selectedDateOfBirth}
                  onChange={(e) => handleDateOfBirthChange(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Autocomplete
                  multiple
                  options={countryOptions}
                  value={SelectedCountries}
                  onChange={handleCountriesChange}
                  renderInput={(params) => <TextField {...params} label="Pays" />}
                />
                <Autocomplete
                  multiple
                  options={languageOptions}
                  value={selectedLanguages}
                  onChange={handleLanguagesChange}
                  renderInput={(params) => <TextField {...params} label="Langues" />}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openEducationDialog} onClose={() => setOpenEducationDialog(false)}>
              <DialogTitle>Modifier Éducation</DialogTitle>
              <DialogContent>
                <Autocomplete
                  multiple
                  options={EducationOptions}
                  value={selectedEducation}
                  onChange={handleEducationChange}
                  renderInput={(params) => <TextField {...params} label="Éducation" />}
                />
                <Button onClick={handleAddEducation}>Ajouter </Button> {/* Add this button */}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEducationDialog(false)}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openCertifDialog} onClose={() => setOpenCertifDialog(false)}>
              <DialogTitle>Modifier Certificats</DialogTitle>
              <DialogContent>
                <Autocomplete
                  multiple
                  options={CertifOptions}
                  value={selectedCertif}
                  onChange={handleCertifChange}
                  renderInput={(params) => <TextField {...params} label="Certificats" />}
                />
                <Button onClick={handleAddCertif}>Ajouter </Button> {/* Add this button */}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenCertifDialog(false)}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openExperienceDialog} onClose={() => setOpenExperienceDialog(false)}>
              <DialogTitle>Modifier Éxperience</DialogTitle>
              <DialogContent>
                <Autocomplete
                  multiple
                  options={experienceOptions}
                  value={selectedExperience}
                  onChange={handleOpenExperienceChange} // Utiliser la nouvelle fonction pour gérer les changements
                  renderInput={(params) => <TextField {...params} label="Éxperience" />}
                />
                <Button onClick={handleAddExperience}>Ajouter </Button> {/* Ajouter ce bouton */}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenExperienceDialog(false)}>Annuler</Button>
                <Button onClick={handleUpdateUser} color="primary">Enregistrer</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openDialogCv} onClose={() => setOpenDialogCv(false)}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
                    <input type="file" accept=".pdf, .doc, .docx, .jpg, .jpeg, .png" onChange={handleFileChange} />
                    <button type="submit" onClick={handleUploadAndClose}  >Upload</button>
          </form>
        </DialogContent>
      </Dialog>

          </>
        )}
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-start",
};

const columnStyle = {
  flex: "1",
  minWidth: "50%",
};

const sectionStyle = {
  marginBottom: "20px",
  padding: "20px",
  background: "#f9f9f9",
  borderRadius: "5px",
  margin: "10px"
};

const headingStyle = {
  marginBottom: "10px",
  color: "#333",
};

const textStyle = {
  color: "#555",
  fontSize: "16px"
};
const editIconStyle = {
  marginRight: "10px"
};
const contactContainer = {
  display: "flex",
  alignItems: "center"
};

export default Overview;