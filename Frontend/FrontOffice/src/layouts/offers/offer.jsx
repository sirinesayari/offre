/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/offers/components/Header";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import myLocalImage from "../offers/img/offre..webp";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from '@mui/icons-material/Favorite'; // Importer l'icône pour le bouton "J'adore"
import { Link } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import io from "socket.io-client";
import { Picker } from 'emoji-mart';
import EmojiInput from 'react-input-emoji';



const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2), // Ajoute un espacement entre les cartes
    padding: theme.spacing(2), // Ajoute un espace à l'intérieur de la carte
    borderRadius: theme.spacing(1), // Ajoute des bords arrondis à la carte
    boxShadow: theme.shadows[1], // Ajoute une ombre à la carte
    backgroundColor: theme.palette.background.paper, // Change la couleur de fond de la carte
  },
  media: {
    height: 300,
    width: '100%', // Utilisez la largeur maximale disponible pour l'image
    objectFit: 'cover', // Assurez-vous que l'image est entièrement visible sans étirement
    borderTopLeftRadius: theme.spacing(1), // Bords arrondis seulement en haut à gauche
    borderTopRightRadius: theme.spacing(1), // Bords arrondis seulement en haut à droite
  },
  title: {
    fontSize: "1.5rem", // Réduisez la taille du titre pour correspondre au style de Facebook
    fontWeight: "bold",
    color: "#DC143C", // Changer la couleur du titre en rouge brique
},

  description: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
  },
  icon: {
    marginRight: theme.spacing(1),
    verticalAlign: "middle",
  },
  detailsText: {
    color: "black",
  },
}));

function Offers() {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [allComments, setAllComments] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = io.connect("http://localhost:5000");

  const [quiz, setQuiz] = useState(null);

   
  

  const itemsPerPage = 6;
  const userId = sessionStorage.getItem("userId");

  const classes = useStyles();
console.log(userId)
useEffect(() => {
  fetchOffers();

  // Écouter l'événement 'newComment' pour mettre à jour les commentaires
  socket.on('commentUpdate', (comment) => {
    setAllComments((prevComments) => ({
      ...prevComments,
      [comment.offerId]: [...(prevComments[comment.offerId] || []), comment],
    }));
  });

  // Écouter l'événement 'likeUpdated' pour mettre à jour les likes
  socket.on('likeUpdated', ({ offerId, likesCount }) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer._id === offerId ? { ...offer, likesCount } : offer
      )
    );
  });

  return () => {
    // Nettoyer les écouteurs d'événements lors du démontage du composant
    socket.off('newComment');
    socket.off('likeUpdated');
  };
}, [searchTerm, sortOrder, currentPage]);



  const fetchOffers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/offer/getall", {
        params: {
          searchTerm: searchTerm,
          sortOrder: sortOrder,
        },
      });
      const offersWithLikes = response.data.map(offer => {
        return {
          ...offer,
          likesCount: offer.likes.length,
        };
      });
      setOffers(offersWithLikes);
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
    setSelectedOffer(offer);
    setOpenModal(true);
    if (!allComments[offer._id]) {
      handleGetAllComments(offer);
    }
  };
  

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleAvatarClick = () => {
    inputRef.current.click();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCommentKeyPress = (e, offerId) => {
    if (e.key === 'Enter') {
      let commentText = e.target.value;
      handleComment(offerId, commentText);
      e.target.value = '';
    }
  };
  const handleGetAllComments = async (offerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/offer/${offerId}/comments`);
      console.log(response.data); // Affichez les commentaires reçus du backend
      // Mettez à jour l'état local des commentaires
      setAllComments({ ...allComments, [offerId]: response.data });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async (offerId) => {
    try {
      const response = await axios.post(`http://localhost:5000/offer/${offerId}/like/${userId}`, { likes: [userId] });
      setLikes(prevLikes => ({
        ...prevLikes,
        [offerId]: true
      }));
      socket.emit('likeUpdated', { offerId, likesCount: response.data.likesCount }); // Émettre l'événement 'likeUpdated'
      alert("Vous avez aimé cette offre !");
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };
  
  const handleDislike = async (offerId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/offer/${offerId}/unlike/${userId}`, { data: { likes: [userId] } });
      setLikes(prevLikes => ({
        ...prevLikes,
        [offerId]: false
      }));
      alert("Vous avez désaimé cette offre !");
    } catch (error) {
      console.error('Error removing like:', error);
    }
  };
  

  const handleComment = async (offerId, comment) => {
    try {
      const response = await axios.post(`http://localhost:5000/offer/${offerId}/comment/add/${userId}`, { text: comment });
      console.log(response.data.message);
      socket.emit('commentUpdate', { offerId, ...response.data.comment }); // Émettre l'événement 'newComment'
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (offerId, comment) => {
    try {
      const response = await axios.delete(`http://localhost:5000/offer/${offerId}/comment/${comment._id}/delete/${userId}`);
      console.log(response.data.message);
      // Affichez un message de succès ici
      alert(response.data.message); // Vous pouvez également utiliser une bibliothèque de notifications comme react-toastify
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      // Affichez un message d'erreur ici
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error); // Affiche l'erreur renvoyée par le serveur
      } else {
        alert('Une erreur est survenue lors de la suppression du commentaire.');
      }
    }
  };
  
  const handleGenerateQuiz = async (niveau, thematique) => {
    setLoading(true);
    try {
      const offerId = sessionStorage.getItem('offerId'); // Retrieve offerId from sessionStorage
      const offer = await axios.get(`http://localhost:5000/offer/get/${selectedOffer._id}`);
      console.log(selectedOffer._id);
      const response = await axios.get(`http://localhost:5000/quiz/generate/${offer.quiz.niveau}/${offer.quiz.thematique}/${selectedOffer._id}`);
      setQuiz(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handlePostuler = async (selectedOffer) => {
    if (selectedOffer.quiz) {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in session storage.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/user/get/${userId}`);
        const email = response.data.email;
        const phone = response.data.phone; // Récupérer le numéro de téléphone de l'utilisateur
        await handleGenerateQuiz(selectedOffer.niveau, selectedOffer.thematique);
        const emailResponse=await axios.post('http://localhost:5000/quiz/send-email', { quiz, email });

        console.log("Email response:", emailResponse.data);
      
        // Envoyer un SMS
        const smsResponse = await axios.post(`http://localhost:5000/offer/send-sms`, {
          recipientNumber: phone,
          message: `Cette offre "${selectedOffer.title}" pour laquelle tu as postulé nécessite de passer un quiz de test.Fais attention!! de ne pas rater ce test de quiz.`
        });
        
        console.log("SMS response:", smsResponse.data);

        // Afficher une alerte de succès
        alert('Quiz et SMS envoyés avec succès !');
        
      } catch (error) {
        console.error('Error sending email or SMS:', error);
        // Afficher une alerte d'erreur
        alert('Une erreur est survenue lors de l\'envoi du quiz ou du SMS.');
      }
    } else {
      window.location.href = `http://localhost:3000/candidature/ajouter/${selectedOffer && selectedOffer._id};`
    }
  };
  
 
  
  const [showComments, setShowComments] = useState({});

const handleToggleComments = async (offerId) => {
  setShowComments((prevComments) => ({
    ...prevComments,
    [offerId]: !prevComments[offerId],
  }));

  if (!showComments[offerId]) {
    await handleGetAllComments(offerId);
  }
};
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={5}>
    
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
            <MDButton variant="gradient" color="info" onClick={() => fetchOffers()}>
              Rechercher
            </MDButton>
          </MDBox>
        </MDBox>
        <Grid container spacing={2}>
          {offers
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((offer) => (
              <Grid item xs={12}  sm={6} md={4}  key={offer._id}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    image={offer.file instanceof Blob ? URL.createObjectURL(offer.file) : myLocalImage}
                    title="Your Image Title"
                  />
                  <CardContent>
                    <Typography variant="h6" className={classes.title}>{offer.title}</Typography>
                    <Typography>
                      <LocationOnIcon className={classes.icon} />
                      {offer.location}
                    </Typography>
                    <Typography>
                      <EventIcon className={classes.icon} />
                      Expiration Date: {formatDate(offer.expirationDate)}
                    </Typography>
                    <Typography variant="h6">commentaires:</Typography>
                    <MDInput
                  type="textarea"
                  placeholder="Votre commentaire..."
                  fullWidth
                  value={comments[offer._id] || ''}
                  onChange={(e) => setComments({ ...comments, [offer._id]: e.target.value })}
                  onKeyPress={(e) => handleCommentKeyPress(e, offer._id)}
                />

                    <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                    <Button
                    onClick={() => handleToggleComments(offer._id)}
                    color="primary"
                  >
                     {showComments[offer._id] ? 'Masquer les commentaires' : 'tous les commentaires'}
</Button>
                        <Button 
  startIcon={<ThumbUpIcon />} 
  size="small"
  onClick={() => handleLike(offer._id)}
  color={likes[offer._id] ? "secondary" : "primary"} 
>
  {offer.likesCount}
</Button>

<Button 
  startIcon={<ThumbDownIcon />} 
  size="small"
  onClick={() => handleDislike(offer._id)}
  color={!likes[offer._id] ? "secondary" : "primary"} 
>
  
</Button>




                      </Grid>
                    </Grid>
                    {showComments[offer._id] &&
  allComments[offer._id] &&
  allComments[offer._id].map((comment, index) => (
                      <Box key={index} mt={2}>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ bgcolor: '#2196F3', marginRight: 1 }}>{comment.user.charAt(0)}</Avatar>
                          <Typography variant="subtitle2" color="text.primary" fontWeight="bold">{comment.user}</Typography>
                        </Box>
                        <Typography>{comment.text}</Typography>
                        <Box display="flex" alignItems="center">
                          <Grid container  display="flex" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" color="text.secondary" ml={1}>
                            {formatDate(comment.createdAt).toLocaleString()}
                          </Typography>
                            <Button
                              onClick={() => handleDeleteComment(offer._id, comment)}
                              color={"primary" }
                            >
                              Supprimer
                            </Button>
                          </Grid>
                        </Box>
                        <Divider />
                      </Box>
                    ))}
                  <Button variant="outlined" color="primary" onClick={() => handleExpandOffer(offer)} style={{ color: '#2196F3' }}>
                      Plus de détails
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Détails de l'offre</DialogTitle>
          <DialogContent>
            {selectedOffer && (
              <div>
                 <Typography className={classes.detailsText}>{selectedOffer.description}</Typography>
                <Typography className={classes.detailsText}>
                  <EventIcon className={classes.detailsText} />
                  Publication Date: {formatDate(selectedOffer.publicationDate)}
                </Typography>
                <Typography className={classes.detailsText}>
                  <WorkIcon className={classes.detailsText} />
                  Type d'offre: {selectedOffer.offerType}
                </Typography>
                <Typography className={classes.detailsText}>
                  <WorkIcon className={classes.detailsText} />
                  Salaire: {selectedOffer.salary}
                </Typography>
                <Typography className={classes.detailsText}>
                  <WorkIcon className={classes.detailsText} />
                  Niveau d'expérience: {selectedOffer.experienceLevel}
                </Typography>
                <Typography className={classes.detailsText}>
                  <WorkIcon className={classes.detailsText} />
                  Type de contrat: {selectedOffer.contractType}
                </Typography>
                <Typography className={classes.detailsText}>
                  <WorkIcon className={classes.detailsText} />
                  Durée de stage: {selectedOffer.internshipDuration}
                </Typography>
                
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Fermer
            </Button>
         
            <Button onClick={() => handlePostuler(selectedOffer)}    color="primary"> 
             Postuler
            </Button>

            </DialogActions>
      </Dialog>
      {/* Pagination section */}
      <MDBox display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          color="error"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          style={{ color: "#E82227" }}
        >
          Précédent
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={currentPage === Math.ceil(offers.length / itemsPerPage)}
          onClick={handleNextPage}
          style={{ color: "#E82227" }}
        >
          Suivant
        </Button>
         
      </MDBox>
      </MDBox>
    <Footer />
  </DashboardLayout>
);

}

export default Offers;
