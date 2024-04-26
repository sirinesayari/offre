/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

// CSS Styles
const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
};

const cellStyles = {
  padding: "8px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
  fontSize: "12px",
  maxHeight: "50px", // Limite la hauteur
  overflowY: "auto", // Ajoute un défilement vertical si nécessaire
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

function OfferManagment() {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchOffers();
  }, [searchTerm, sortOrder]);
 // Fonction pour formater la date
 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Récupérer uniquement la partie de la date sans l'heure et le fuseau horaire
};
  const fetchOffers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offer/getall", {
        params: {
          searchTerm: searchTerm,
          sortOrder: sortOrder,
        },
      });
      setOffers(response.data);
      console.log('Search with searchTerm:', searchTerm, 'and sortOrder:', sortOrder);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };
// Fonction pour archiver automatiquement les offres expirées
const archiveExpiredOffers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/offer/getall");
    const allOffers = response.data;
    const currentDate = new Date();

    // Parcourir toutes les offres pour vérifier si elles sont expirées
    allOffers.forEach(async (offer) => {
      const expirationDate = new Date(offer.expirationDate);
      if (currentDate >= expirationDate && !offer.archived) {
        // Si l'offre est expirée et non archivée, l'archiver
        await axios.put(`http://localhost:5000/offer/${offer._id}/archiveExpired`);
      }
    });
  } catch (error) {
    console.error("Error archiving expired offers:", error);
  }
};

// Appeler la fonction d'archivage automatique au chargement initial de la page
useEffect(() => {
  archiveExpiredOffers();
}, []);

  const handleArchiveOffer = async (offerId) => {
    try {
      if (!offerId || typeof offerId !== "string") {
        console.error("Invalid offer ID:", offerId);
        return;
      }
  
      await axios.put(`http://localhost:5000/offer/${offerId}/archive`);
  
      setOffers((prevOffers) =>
        prevOffers.map((prevOffer) =>
          prevOffer._id === offerId ? { ...prevOffer, archived: true } : prevOffer
        )
      );
      window.alert("Offre archivée avec succès!");
    } catch (error) {
      console.error(
        "Error archiving offer:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };
  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const [expandedOffers, setExpandedOffers] = useState({});

  const toggleExpandOffer = (offerId) => {
    setExpandedOffers(prevState => ({
      ...prevState,
      [offerId]: !prevState[offerId]
    }));
  };
  const [open, setOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);

  const handleOpenDialog = (description) => {
    setSelectedDescription(description);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDescription(null);
  };
  const handleGeneratePDF = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offer/generate-pdf", {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'offers.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    }
  };
  return (
    <DashboardLayout>
       <DashboardNavbar />
      <MDBox mt={8}> {/* Remove top margin */}
        <MDBox mb={2} className="graph-container"> {/* Remove bottom margin */}
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
              Liste Des Offres
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={4} pb={3} px={3}>
          <MDBox flex="4"  mt={2} mb={8}>
          <MDInput
    type="textarea"
    placeholder="Rechercher..."
    fullWidth
    value={searchTerm}
    onChange={handleChangeSearchTerm}
  />
          </MDBox>
          
        <MDBox flex="1" mt={2} mb={8}>
            <MDButton variant="gradient" color="info"  style={buttonStyles}  onClick={() => fetchOffers()}>
              Rechercher
            </MDButton>
          </MDBox>
        </MDBox>
      
      <MDBox mt={8}>
        <MDBox mb={3}>
          <tr>
            <td colSpan="6" style={cellStyles}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    component={Link}
                    to="/offers/ajouter"
                  >
                    Ajouter  Un Offre
                  </MDButton>
                
            </td>
            <td colSpan="3" style={cellStyles}>
      <MDButton
        variant="gradient"
        color="info"
        fullWidth
        component={Link}
        to="/archive"
      >
        Les Archives
      </MDButton>
      </td>
      <td colSpan="3" style={cellStyles}>
  <MDButton
    variant="gradient"
    color="info"
    fullWidth
    onClick={handleGeneratePDF}
  >
    PDF
  </MDButton>

    </td>
    <td colSpan="3" style={cellStyles}>
  <MDButton
    variant="gradient"
    color="info"
    fullWidth
    component={Link}
        to="/offers/send-email"
  >
    envoyer un email
  </MDButton>

    </td>
          </tr>
          <table style={tableStyles}>
          <thead>
  <tr>
    <th style={headerStyles}>Title</th>
    <th style={headerStyles}>Description</th>
    <th style={headerStyles}>Location</th>
    <th style={headerStyles}>Salary</th>
    <th style={headerStyles}>Experience Level</th>
    <th style={headerStyles}>Offer Type</th>
    <th style={headerStyles}>Publication Date</th>
    <th style={headerStyles}>Expiration Date</th>
    <th style={headerStyles}>Contract Type</th>
    <th style={headerStyles}>Internship Duration</th>
    <th style={headerStyles}>Actions</th>
  </tr>
</thead>
<Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Description complète</DialogTitle>
        <DialogContent>
          {selectedDescription}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseDialog} color="primary">
            Fermer
          </MDButton>
        </DialogActions>
      </Dialog>
<tbody>
  {offers.map((offer, index) => (
    <tr key={index} style={index % 2 === 0 ? evenRowStyles : {}}>
      <td style={cellStyles}>{offer.title.length > 15 && expandedOfferId !== offer._id ? (
        <>
          {offer.title.substring(0, 15)}
          <Button
            variant="gradient"
            color="info"
            style={buttonStyles}
            onClick={() => handleOpenDialog(offer.title)}
          >
            ...
          </Button>
        </>
      ) : (
        offer.title
      )}
    </td>
    <td style={cellStyles}>{offer.description.length > 15 && expandedOfferId !== offer._id ? (
     <>
     {offer.description.substring(0, 15)}
     <Button
       variant="gradient"
       color="info"
       style={buttonStyles}
       onClick={() => handleOpenDialog(offer.description)}
     >
       ...
     </Button>
   </>
 ) : (
   offer.description
 )}
</td>
           
    
      <td style={cellStyles}>{offer.location}</td>
      <td style={cellStyles}>{offer.salary}</td>
      <td style={cellStyles}>{offer.experienceLevel.length > 15 && expandedOfferId !== offer._id ? (
     <>
     {offer.experienceLevel.substring(0, 15)}
     <Button
       variant="gradient"
       color="info"
       style={buttonStyles}
       onClick={() => handleOpenDialog(offer.experienceLevel)}
     >
       ...
     </Button>
   </>
 ) : (
   offer.experienceLevel
 )}
</td>
      <td style={cellStyles}>{offer.offerType}</td>
      <td style={cellStyles}>{formatDate(offer.publicationDate)}</td>
      <td style={cellStyles}>{formatDate(offer.expirationDate)}</td>
      <td style={cellStyles}>{offer.contractType}</td>
      <td style={cellStyles}>{offer.internshipDuration}</td>
      <td style={{ ...cellStyles, ...buttonContainerStyles }}>
        <MDButton variant="gradient" color="info" style={buttonStyles}>
          <Link to={`/offers/modifier/${offer._id}`} style={{ textDecoration: "none", color: "white" }}>Modifier</Link>
        </MDButton>
        <MDButton variant="gradient" color="info" style={buttonStyles} onClick={() => handleArchiveOffer(offer._id)}>
          Archiver
        </MDButton> 
        <MDButton variant="gradient" color="info" style={buttonStyles}>
          <Link to={`/condidacyManagement/${offer._id}`}  style={{ textDecoration: "none", color: "white" }}>condidatures</Link>
        </MDButton>
        <MDButton variant="gradient" color="info" style={buttonStyles}>
          <Link to={`/quiz`}  style={{ textDecoration: "none", color: "white" }}>Quiz</Link>
        </MDButton>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </MDBox>
      </MDBox>
      <Footer />
      </MDBox> </MDBox>
    </DashboardLayout>
  );
}

export default OfferManagment;