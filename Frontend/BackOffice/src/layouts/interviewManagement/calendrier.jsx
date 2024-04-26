/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Alert, Box, Card, CardContent, Grid, Icon, Typography } from "@mui/material";
import Footer from "examples/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import axios from "axios";
import 'moment/locale/fr';
import { Link } from "react-router-dom";
import Forminput from "./forminput";
import { blue, grey, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);
moment.locale('fr');

function Calendrier() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [assignedStudent, setAssignedStudent] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const userId = getCookie("userId");  
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/interviews/getCompagny/${userId}`);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }
  
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: moment(event.dateInterv, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        end: moment(event.dateInterv, 'YYYY-MM-DDTHH:mm:ss').toDate(),
      }));
  
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };
  
  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    setInterviewId(event._id);
  };

  const handleCloseDetails = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const deleteInterview = () => {
    axios
      .delete(`http://localhost:5000/interviews/deleteintrv/${interviewToDelete}`)
      .then(() => {
        fetchEvents();
        handleCloseDetails();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'entretien:", error);
      })
      .finally(() => {
        setInterviewToDelete(null);
      });
  };

  const handleDeclineClick = (interviewId) => {
    setInterviewToDelete(interviewId);
    setConfirmationOpen(true);
  };
  
  const handleConfirmationClose = (confirmed) => {
    setConfirmationOpen(false);
    if (confirmed) {
      deleteInterview();
    } else {
      setInterviewToDelete(null);
    }
  };
  const [message, setMessage] = useState(null);
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
    }, 10000); 
  };
  const requestAnotherDate = (interviewId) => {
    fetch(`http://localhost:5000/interviews/fixAnotherDate/${interviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Erreur HTTP ${response.status}`);
        }
    })
    .then(data => {
        console.log('Réponse du serveur:', data);
        if (data && data.success) {
            setInterviews(prevInterviews => {
                const updatedInterviews = prevInterviews.map(interview => {
                    if (interview._id === interviewId) {
                        return { ...interview, statusInterv: "Demande report" };
                    }
                    return interview;
                });
                return updatedInterviews;
            });
            showMessage("Votre demande a été envoyée avec succès!");
        } else {
            showMessage("Une erreur s'est produite ! Réessayez plus tard");
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
        showMessage(`Erreur lors de l'envoi de la demande: ${error.message}`);
    })
};
  

  const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement',
    showMore: total => `+ ${total} de plus`
  };
  const formatInterviewDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString().slice(-2);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year}   ${hours}:${minutes}`;
  };

  const fetchAssignedStudent = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/get/${studentId}`); 
      setAssignedStudent(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'utilisateur :', error);
    }
  };
  useEffect(() => {
    if (selectedEvent && selectedEvent.assignedStudentId) {
      fetchAssignedStudent(selectedEvent.assignedStudentId);
    }
  }, [selectedEvent]);


  const [showFormPopup, setShowFormPopup] = useState(false);

  const handleOpenAddForm = () => {
    setShowFormPopup(true);
  };

  const handleCloseFormPopup = () => {
    setShowFormPopup(false);
  };

  const handleOpenEditForm = (event) => {
    setSelectedEvent(event); // Définir l'événement sélectionné
    setDialogOpen(false); // Fermer le dialogue actuel
    setShowFormPopup(true); // Ouvrir le dialogue avec le formulaire rempli
  };

  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    if (selectedEvent) {
      const { title, assignedStudentName, start , typeIntrv , assignedStudentId } = selectedEvent;
      const formattedDate = moment(start).format("DD/MM/YY HH:mm");
      const url = `/feedback_Management?title=${title}&candidate=${assignedStudentName}&date=${formattedDate}&typeIntrv=${typeIntrv}&assignedStudentId=${assignedStudentId}`;
      navigate(url);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ position: 'absolute', top: '90%', left: '0' , marginLeft:'17px'}}>
        <Card style={{ transform: 'rotate(-90deg)', transformOrigin: 'left top', height: '70%', width: '100%', backgroundColor: "#eeeeee", padding: 0 }}>
          <CardContent style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 0, paddingTop: 0 }}>
            <Typography style={{ fontWeight: "600", fontSize: "15px", color: "#344880" }}>Etat entretien : </Typography>
            <Box display="flex" alignItems="center" ml={2}>
              <Box display="inline-block" width={10} height={7} bgcolor="rgba(246, 10, 10, 0.6)" mr={1} borderRadius={3} />
              <Typography style={{ fontWeight: "550", fontSize: "12px" }}>Décliné</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={2}>
              <Box display="inline-block" width={10} height={7} bgcolor="#eb861b" mr={1} borderRadius={3} />
              <Typography style={{ fontWeight: "550", fontSize: "12px" }}>Demande report</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={2}>
              <Box display="inline-block" width={10} height={7} bgcolor="rgba(102, 138, 186, 0.962)" mr={1} borderRadius={3} />
              <Typography style={{ fontWeight: "550", fontSize: "12px" }}>A venir</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={2}>
              <Box display="inline-block" width={10} height={7} bgcolor="#00c860" mr={1} borderRadius={3} />
              <Typography style={{ fontWeight: "550", fontSize: "12px" }}>Terminé</Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
      <Typography  mb={1.2} variant="h2" style={{ display: 'flex' , justifyContent: 'center' }}>
        Vos entretiens
        <Button style={{marginTop:"10px", color: 'red', marginLeft: "430px", justifyContent: 'flex-end' }} onClick={handleOpenAddForm} >
          <Icon style={{ marginRight: "10px" }} fontSize="small">add_to_photos</Icon>Ajouter entretien
        </Button>
        <Icon style={{ marginRight: "8px", marginTop:"18px" , color: 'red'}} fontSize="small">airplay</Icon>
        <Link to="/meet" style={{ fontSize:"13px" , fontWeight:"440", marginTop:"21px", color: 'red', justifyContent: 'flex-end' }} >
          DÉMARRER UNE RÉUNION
        </Link>
      </Typography>
      {message && (
              <Alert style={{ textAlign: "center" , marginBottom: "15px" , marginLeft:"50px"}}>
                <strong>{message}</strong>
                </Alert>
            )}
      <MDBox  mb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={8} md={11} mr={2} >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleEventClick}
              style={{ height: '500px' }}
              messages={messages}
              eventPropGetter={(event) => {
                let color = 'red'; 
                switch (event.statusInterv) {
                  case 'Décliné':
                    color = 'rgba(246, 10, 10, 0.6) ';
                    break;
                  case 'Demande report':
                    color = '#eb861bb2';
                    break;
                  case "A venir":
                    color= "rgba(102, 138, 186, 0.962) ";
                    break;
                  case "Terminé":
                    color =  "#00c860";
                    break;
                  default:
                    color = 'gray';
                    break;
                }
                return {
                  style: {
                    backgroundColor: color,
                    color: 'white', 
                  },
                };
                }}
            />
            {/* <Button style={{ marginInline: "43%", marginTop: "20px", color: 'red' }} onClick={handleCloseDetails}>
              <Icon style={{ marginRight: "10px" }} fontSize="small">undo</Icon>
              <Link style={{ color: 'inherit' }} to={`/interviewManagement`}>Retour</Link>
            </Button> */}
            <Dialog open={dialogOpen} onClose={handleCloseDetails}>
              <Icon style={{ marginLeft: "370px" , marginTop : "10px"}} fontSize="small" onClick={handleCloseDetails} >close</Icon>
                <DialogTitle>{selectedEvent && selectedEvent.title}</DialogTitle>
                <DialogContent style={{ height: '340px', width: '400px' }} >
                  {selectedEvent && (
                    <div className="event-details">
                      <h3 className="red-text" style={{ marginBottom: "25px" }}>{selectedEvent.descrInter}</h3>
                      <p className="thin-text"><strong>Nom du candidat :</strong> {selectedEvent.assignedStudentName}</p>
                      <p className="thin-text"><strong>Date :</strong>{formatInterviewDate(selectedEvent.dateInterv)}</p>
                      <p className="thin-text"><strong>Adresse :</strong>{selectedEvent.address}</p>
                      <p className="thin-text"><strong>Type de rencontre :</strong>{selectedEvent.typeRencontre}</p>
                      <p className="thin-text"><strong>Type d'entretien :</strong>{selectedEvent.typeIntrv}</p>
                      <p className="thin-text"><strong>Etat entretien :</strong>{selectedEvent.statusInterv}</p>
                    </div>
                  )}
                    <div style={{ display: "flex", marginTop: "16px" }}>
                          <Button style={{ marginRight: "8px", color: 'red' }} onClick={() => handleDeclineClick(selectedEvent._id)} >
                            Décliner
                          </Button>
                          <Button style={{ color: 'red' }} onClick={() => {
                            handleCloseDetails(); // Fermer le dialogue actuel
                            handleOpenEditForm(selectedEvent); // Ouvrir le dialogue avec le formulaire rempli
                          }} >
                            Modifier
                          </Button>
                          
                    </div>
                </DialogContent>
                <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
                  <DialogTitle>Voulez-vous vraiment décliner cet entretien ?</DialogTitle>
                  <DialogActions>
                    <Button onClick={() => handleConfirmationClose(false)} color="primary">
                      Non
                    </Button>
                    <Button onClick={() => handleConfirmationClose(true)} color="primary">
                      Oui
                    </Button>
                  </DialogActions>
              </Dialog> 
            </Dialog>
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={showFormPopup} onClose={handleCloseFormPopup}>
      <DialogActions>
          <Button style={{color: 'red'}} onClick={handleCloseFormPopup}><Icon fontSize="medium">close</Icon></Button>
        </DialogActions>
        <DialogTitle style={{ display: 'flex' , justifyContent: 'center' }}>{selectedEvent ? "Modifier un entretien" : "Ajouter un entretien"}</DialogTitle>
        <DialogContent style={{ display: 'flex' , justifyContent: 'center' }}>
          <Forminput interviewId={interviewId} selectedEvent={selectedEvent} />
        </DialogContent>
        
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
export default Calendrier;

