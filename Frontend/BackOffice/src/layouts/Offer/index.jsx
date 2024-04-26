/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios"; // Importer axios
import Button from "@mui/material/Button";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import myLocalImage from "../Offer/img/offre..webp";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { MenuItem } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    maxWidth: 600, // Adjust max width for desktop
  },
  media: {
    height: 300, // Adjust height for desktop
  },
  title: {
    fontSize: "1.5rem", // Adjust title font size
    fontWeight: "bold",
    color: theme.palette.primary.main, // Title color
  },
  description: {
    fontSize: "1rem", // Adjust description font size
    color: theme.palette.error.main, // Description color
  },
  icon: {
    marginRight: theme.spacing(1),
    verticalAlign: "middle",
  },
}));

function Offers() {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const itemsPerPage = 6;

  const classes = useStyles();

  useEffect(() => {
    fetchOffers();
  }, [searchTerm, sortOrder, currentPage]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offer/getall", {
        params: {
          searchTerm: searchTerm,
          sortOrder: sortOrder,
        },
      });
      setOffers(response.data);
      console.log('Recherche avec searchTerm:', searchTerm, 'et sortOrder:', sortOrder);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleExpandOffer = (offer) => {
    setExpandedOffer(offer);
  };

  const handleCollapseOffer = () => {
    setExpandedOffer(null);
  };

  const handlePostuler = (offer) => {
    // Logic to handle postuler button click
    console.log("Postuler clicked for offer:", offer);
    // You can implement further logic here, like opening a modal, redirecting, etc.
  };

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
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Liste Des Offres
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={4} pb={3} px={3}>
          <MDBox flex="1" mr={4}>
            <MDInput
              type="textarea"
              placeholder="Rechercher..."
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </MDBox>
          <MDBox flex="1" mr={2}>
            <MDInput
              type="text"
              variant="standard"
              fullWidth
              select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Croissant</MenuItem>
              <MenuItem value="desc">Décroissant</MenuItem>
            </MDInput>
          </MDBox>
          <MDBox flex="1" mt={2} mb={8}>
            <MDButton variant="gradient" color="info" fullWidth onClick={() => fetchOffers()}>
              Rechercher
            </MDButton>
          </MDBox>
        </MDBox>
    
        <Grid container spacing={2}>
          {offers
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((offer) => (
              <Grid item xs={12} sm={6} md={4} key={offer._id}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    image={offer.file instanceof Blob ? URL.createObjectURL(offer.file) : myLocalImage}
                    title="Your Image Title"
                  />
                  <CardContent>
                    <Typography variant="h6" className={classes.title}>{offer.title}</Typography>
                    <Typography className={classes.description}>{offer.description}</Typography>
                    <Typography>
                      <LocationOnIcon className={classes.icon} />
                      {offer.location}
                    </Typography>
                    <Typography>
                      <EventIcon className={classes.icon} />
                      Publication Date: {offer.publicationDate}
                    </Typography>
                    <Typography>
                      <EventIcon className={classes.icon} />
                      Expiration Date: {offer.expirationDate}
                    </Typography>
                    <Typography>
                      <WorkIcon className={classes.icon} />
                      Type d'offre: {offer.offerType}
                    </Typography>
                    {expandedOffer === offer ? (
                      <div>
                        <Typography>
                          <WorkIcon className={classes.icon} />
                          Salaire: {offer.salary}
                        </Typography>
                        <Typography>
                          <WorkIcon className={classes.icon} />
                          Niveau d'expérience: {offer.experienceLevel}
                        </Typography>
                        <Typography>
                          <WorkIcon className={classes.icon} />
                          Type de contrat: {offer.contractType}
                        </Typography>
                        <Typography>
                          <WorkIcon className={classes.icon} />
                          Durée de stage: {offer.internshipDuration}
                        </Typography>
                        {/* Ajoutez d'autres attributs ici */}
                        <Button variant="outlined" color="primary" onClick={handleCollapseOffer} style={{ color: '#2196F3' }}>
                          Moins de détails
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outlined" color="primary" onClick={() => handleExpandOffer(offer)} style={{ color: '#2196F3' }}>
                        Plus de détails
                      </Button>
                    )}
                    {/* Add "Postuler" button */}
                    <Button
  variant="outlined"
  color="primary"
  component={Link}
  to={`/candidature/ajouter`} // Passer l'ID de l'offre comme paramètre d'URL
>
  Postuler
</Button>

</CardContent>
</Card>
</Grid>
))}
</Grid>
    {/* Pagination section */}
    <MDBox display="flex" justifyContent="space-between" mb={2}>
      <Button
        variant="contained"
        color="error"
        disabled={currentPage === 1}
        onClick={handlePreviousPage}
        style={{ color: "#E82227" }}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="error"
        disabled={currentPage === Math.ceil(offers.length / itemsPerPage)}
        onClick={handleNextPage}
        style={{ color: "#E82227" }}
      >
        Next
      </Button>
    </MDBox>
  <Footer />
</DashboardLayout>
  );
}

export default Offers;