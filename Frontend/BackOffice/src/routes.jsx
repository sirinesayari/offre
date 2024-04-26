/* eslint-disable */
// Material Dashboard 2 React layouts

import Dashboard from "layouts/dashboard";
//commit 
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ResetPassword from "layouts/authentication/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";

import Statistics from "layouts/statistics";

import UserManagement from "layouts/userManagement";

import UserDetails from "layouts/userManagement/UserDetails";
import Ajout from "layouts/userManagement/ajout";

import Calendrier from "layouts/interviewManagement/calendrier";
import FeedBackManagement from "layouts/feedbackManagement";
import FeedBack from "layouts/feedbackManagement/feedback_ai";

import InterviewManagement from "layouts/interviewManagement";
import CondidacyManagement from "layouts/condidacyManagement";
import Question from "layouts/GetQuestions";
import AddQuestionForm from "layouts/AddQuestion";
import ModifierQuestionForm from "layouts/PutQuestion";
import QuizComponent from "layouts/Quiz";
import ModifyQuestion from "layouts/PutQuestion";
import ArchivedCandidatures from "layouts/ajouter";
import UpdateOffer from "layouts/profile/modifier";
import Ajouter from "layouts/profile/ajouter";
import Archive from "layouts/profile/archiver";
import OfferManagement from "layouts/profile";
import AcceptedCandidatures from "layouts/accept";
import OfferStatistics from "layouts/profile/statistic";



import Meet from "layouts/interviewManagement/meet";
import App from "layouts/profile/email";
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
const userRole = getCookie("userRole");

const routes = [
  {
    route: "/authentication/rest-password",
    component: <ResetPassword />,
  },
  {

    type: "route",
    name: "Détails de l'utilisateur",
    key: "details-utilisateur",
    route: "/user/:userId", // Make sure it matches the backend route
    component: <UserDetails />, // Composant UserDetailsPage à afficher lorsque cette route est visitée
  },
  {
    type: "route",
    name: "Ajouter un utilisateur",
  key: "ajouter-utilisateur",
    route:  "/AddUser",
    component: <Ajout />, // Composant UserDetailsPage à afficher lorsque cette route est visitée
  },
   
  {

    type: "collapse",
    name: "Accueil",
    key: "Accueil",
    icon: <Icon fontSize="small">home</Icon>,

    route: `/dashboard`,
    component: <Dashboard />,

  },
  {
    type: "collapse",

    name: "Statistiques",
    key: "statistiques",
    icon: <Icon fontSize="small">bar_chart</Icon>,
    route: "/statistics",
    component: userRole === "Admin" || userRole === "subadmin" ? <Statistics /> : null,

  },
  {
    type: "collapse",
    name: "Gestion des utilisateurs",
  key: "gestion-utilisateurs",
  icon: <Icon fontSize="small">people</Icon>,
  route: "/userManagement",
  component: userRole === "Admin" || userRole === "subadmin" ? <UserManagement /> : null,
},

 
  {
    type: "collapse",
    name: "Gestion des entretiens",
  key: "gestion-entretiens",
  icon: <Icon fontSize="small">calendar_today</Icon>,
  route: "/calendrier",
    component: <Calendrier />,

  },
  // {
  //   type: "route",
  //   name: "calendrier", 
  //   key: "calendrier", 
  //   route: "/calendrier", 
  //   component: <Calendrier />, 
  // },
  {
    type: "collapse",
    name: "Gestion des évaluations",
  key: "gestion-évaluations",
  icon: <Icon fontSize="small">feedback</Icon>,
  route: "/feedback",
    component: <FeedBackManagement />,

  },
  {
    type: "route",
    name: "Enregistreur vocal",
  key: "enregistreur-vocal", 
    route: "/enregistreur_vocale", 
    component: <FeedBack />, 
  },

  // {
  //   type: "route",
  //   name: "Gestion des évaluations",
  // key: "gestion-évaluations",
  //   route: "/feedback_Management", 
  //   component: <FeedBackManagement />, 
  // },


  {
    type: "route",
    name: "feedback_Management", 
    key: "feedback_Management", 
    route: "/feedback_Management", 
    component: <FeedBackManagement />, 
  },
  {
    type: "route",
    name: "meet", 
    key: "meet", 
    route: "/meet", 
    component: <Meet />, 
  },
  
{ type: "route",
    name: "calendrier", 
    key: "calendrier", 
    route: "/calendrier", 
    component: <Calendrier />, 
  },
  {
    type: "route",
    name: "Gestion des candidatures",
    key: "gestion-candidatures",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/condidacyManagement/:offreId",
    component: <CondidacyManagement />,

  },
  {
    type: "route",
    name: "acc",
    key: "",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/accept",
    component: <AcceptedCandidatures />,
  },
 
  {
    type: "route",
    name: "modifier",
    key: "modif",
    icon: <Icon fontSize="small">edit</Icon>,
    route: "/modifier/:id",
    component: <ModifyQuestion />,
  },
  {
    type: "route",
    name: "arch",
    key: "arch",
    icon: <Icon fontSize="small">archive</Icon>,
    route: "/archives",
    component: <ArchivedCandidatures />,
  },
 
   
    {
    type: "route",
    name: "Gestion des questions",
    key: "gestion-questions",
    icon: <Icon fontSize="small">question_answer</Icon>,
    route: "/Question",
    component: <Question />,
  },
  {
    type: "route",
    name: "Entreprise",
  key: "entreprise",
  icon: <Icon fontSize="small">add</Icon>,
  route: "/question/ajouter",
    component: <AddQuestionForm/>,
  },
  {
    type: "route",
    name: "Gestion des quiz",
    key: "gestion-quiz",
    icon: <Icon fontSize="small">quiz</Icon>,
    route: "/quiz",
    component: <QuizComponent />,
  },
  {
    type: "collapse",
    name: "Gestion des offres",
    key: "gestion-offres",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/offerManagement",
    component: <OfferManagement />,
  },
  {
    type: "collapse",
    name: "Connexion",
  key: "connexion",
    icon: <Icon fontSize="small">login</Icon>,

    route: "http://localhost:3000/authentication/sign-in",

    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Inscription",
  key: "inscription",
    icon: <Icon fontSize="small">assignment</Icon>,

    route: "http://localhost:3000/authentication/sign-up",

    component: <SignUp />,
  },
  {
    type: "route",
    name: "archive",
    key: "archive",
    route: "/archive",
    component: <Archive />,
  },
  {
    type: "route",
    name: "Ajouter",
    key: "ajouter",
    route: "/offers/ajouter",
    component: <Ajouter />,
  },
  {
    type: "route",
    name: "Modifier",
    key: "modifier-notifications",
    route: "/offers/modifier/:id",
    component: <UpdateOffer />,
  },
  {
    type: "route",
    name: "email",
    key: "email",
    route: "/offers/send-email",
    component: <App />,
  },
  {
    type: "collapse",
    name: "statictic",
    key: "",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/offerStatictic",
    component: <OfferStatistics />,
  },
 
  
];

export default routes;