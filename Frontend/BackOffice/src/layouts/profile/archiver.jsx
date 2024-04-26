/*eslint-disable*/import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import Button from '@material-ui/core/Button';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// CSS Styles
const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
};
const buttonStyles = {
  cursor: "pointer",
  marginRight: "5px",
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

function Archive() {
  const [archivedOffers, setArchivedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    fetchArchivedOffers();
  }, [searchTerm,sortOrder]);
    const fetchArchivedOffers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/offer/archived", {
          params: {
            searchTerm: searchTerm,
            sortOrder: sortOrder,
          },
        });
        setArchivedOffers(response.data);
        console.log('Search with searchTerm:', searchTerm, 'and sortOrder:', sortOrder);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
   
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Récupérer uniquement la partie de la date sans l'heure et le fuseau horaire
  };

 

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleUnarchiveOffer = async (offerId) => {
    try {
      if (!offerId || typeof offerId !== "string") {
        console.error("Invalid offer ID:", offerId);
        return;
      }

      await axios.put(`http://localhost:5000/offer/${offerId}/unarchive`);
      fetchArchivedOffers();
      window.alert("Offre désarchivée avec succès!");
    } catch (error) {
      console.error(
        "Error unarchiving offer:",
        error.response ? error.response.data : error.message
      );
      setError(error);
    }
  };
  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const [selectedDescription, setSelectedDescription] = useState(null);
  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenDialog = (description) => {
    setSelectedDescription(description);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDescription(null);
  };
  return (
    <DashboardLayout>
      <Header>
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
            Liste Des Offres Archivées
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
            <MDButton variant="gradient" color="info"  style={buttonStyles}  onClick={() => fetchArchivedOffers()}>
              Rechercher
            </MDButton>
          </MDBox>
          <MDBox flex="1" mt={2} mb={8}>

          <Link to="/offerManagement">
            <MDButton Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} >
            Retour
          </MDButton>
        </Link>
          </MDBox>
          </MDBox>


        <MDBox mt={8}>
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
              </tr>
            </thead>
            <tbody>
              {archivedOffers.length > 0 && archivedOffers.map((offer, index) => (
                <tr key={offer._id} style={index % 2 === 0 ? evenRowStyles : {}}>
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
                  <td style={cellStyles}>{offer.experienceLevel}</td>
                  <td style={cellStyles}>{offer.offerType}</td>
                  <td style={cellStyles}>{formatDate(offer.publicationDate)}</td>
                  <td style={cellStyles}>{formatDate(offer.expirationDate)}</td>
                  <td style={cellStyles}>{offer.contractType}</td>
                  <td style={cellStyles}>{offer.internshipDuration
                                    }</td>
                                     <MDButton 
                variant="gradient" 
                color="info" 
                style={buttonStyles} 
                onClick={() => handleUnarchiveOffer(offer._id)}
              >
                Désarchiver
              </MDButton>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </MDBox>
                          </Header>
                          <Footer />
                        </DashboardLayout>
                      );
                    }
                    
                    export default Archive;
                    
