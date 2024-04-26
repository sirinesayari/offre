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
import { Alert, Grid, Icon } from "@mui/material";
import Footer from "examples/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import axios from "axios";
import 'moment/locale/fr';
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);
moment.locale('fr');

function Calendrier() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);


  useEffect(() => {
    const fetchStudentInterviews = async () => {
        try {
            const userId  = sessionStorage.getItem('userId');
            console.log('ID du user récupéré utilisant sessionStorage :', userId ); 
            if (!userId ) {
                console.error("ID de user non trouvé dans le sessionStorage");
                return;
            }
            const response = await axios.get(`http://localhost:5000/interviews/getInterviewsByStudentId/${userId}`);
            const studentInterviews = response.data;
            const filteredInterviews = studentInterviews.filter(interview => interview.statusInterv !== "Décliné");
    
            const formattedEvents = filteredInterviews.map(event => ({
                ...event,
                start: moment(event.dateInterv, 'YYYY-MM-DDTHH:mm:ss').toDate(),
                end: moment(event.dateInterv, 'YYYY-MM-DDTHH:mm:ss').toDate(),
            }));
    
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Erreur lors de la récupération des entretiens:", error);
        }
    };

    fetchStudentInterviews();
}, []);

  
  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const deleteInterview = () => {
    axios
      .delete(`http://localhost:5000/interviews/deleteintrv/${interviewToDelete}`)
      .then(() => {
        fetchStudentInterviews();
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

  const redTextStyle = {
    color: 'white',
    backgroundColor: 'rgba(500, 10, 20, 0.7)',
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {message && (
              <Alert style={{ textAlign: "center" , marginBottom: "15px" , marginLeft:"50px"}}>
                <strong>{message}</strong>
                </Alert>
            )}
      <MDBox mt={3} mb={0}>
        <Grid container justifyContent="center">
          <Grid item xs={8} md={10}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleEventClick}
              style={{ height: '500px' }}
              messages={messages}
              eventPropGetter={() => ({ style: redTextStyle })}
            />
            <Button style={{ marginInline: "43%", marginTop: "20px", color: 'red' }} onClick={handleCloseDetails}>
              <Icon style={{ marginRight: "10px" }} fontSize="small">undo</Icon>
              <Link style={{ color: 'inherit' }} to={`/entretien`}>Retour</Link>
            </Button>
            <Dialog open={dialogOpen} onClose={handleCloseDetails}>
              <Icon style={{ marginLeft: "370px" , marginTop : "10px"}} fontSize="small" onClick={handleCloseDetails} >close</Icon>
                <DialogTitle>{selectedEvent && selectedEvent.title}</DialogTitle>
                <DialogContent style={{ height: '270px', width: '400px' }} >
                  {selectedEvent && (
                    <div className="event-details">
                      <h3 className="red-text" style={{ marginBottom: "25px" }}>{selectedEvent.descrInter}</h3>
                      <p className="thin-text"><strong>Date :</strong>{formatInterviewDate(selectedEvent.dateInterv)}</p>
                      <p className="thin-text"><strong>Adresse :</strong>{selectedEvent.address}</p>
                      <p className="thin-text"><strong>Type d'entretien :</strong>{selectedEvent.typeIntrv}</p>
                      <p className="thin-text"><strong>Etat entretien :</strong>{selectedEvent.statusInterv}</p>
                    </div>
                  )}
                    <div style={{ display: "flex", marginTop: "16px" }}>
                          <Button style={{ marginRight: "8px", color: 'red' }} onClick={() => handleDeclineClick(selectedEvent._id)} >
                            Décliner
                          </Button>
                          <Button style={{ color: 'red' }} onClick={() => requestAnotherDate(selectedEvent?._id)} disabled={selectedEvent?.statusInterv === "Demande report"} >
                            Autre date ?
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
      <Footer />
    </DashboardLayout>
  );
}
export default Calendrier;

