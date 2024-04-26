/* eslint-disable */
// Material Dashboard 2 React layouts

import ForgotPassword from "layouts/authentication/ForgotPassword";

// @mui icons
import PasswordReset from "layouts/authentication/PasswordReset";
import Network from "layouts/network";
import ProfileN from "layouts/network/profileN";
import ChatManagement from "layouts/Chat/Chat";

import Interview from "layouts/interview";
import Calendrier from "layouts/interview/calendrier";
import Feedback from "layouts/feedback";
import Meet from "layouts/interview/meet";


import Dashboard from "layouts/dashboard";

import Candidacy from "layouts/Candidacy";


import Profile from "layouts/profile";


//import OfferManagement from "layouts/profile";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
//offer backoffise
//import UpdateOffer from "layouts/profile/modifier";
//import Ajouter from "layouts/profile/ajouter";
//import Archive from "layouts/profile/archiver";
import Offers from "layouts/offers/offer";


//import Candidacy from "layouts/candidacy";



/*esplin-disabled*/
// @mui icons
import Icon from "@mui/material/Icon";


// @mui icons

import QuizComponent from "layouts/Quiz";


import CandidatureCandidat from "layouts/MesCandidatures";
const routes = [
  {
    route: "/forgot-password",
    component: <ForgotPassword />,
  },
  
  {
    route: "/password-reset/:id/:token",
    component: <PasswordReset />,
  },
  {
    type: "route",
    name: "Profil", // Nom de la route affiché dans le sidenav
    key: "profil-utilisateur", // Clé unique pour cette route
    route: "/user/:userId", // Assurez-vous qu'elle correspond à la route du backend
    component: <ProfileN />,
   },
 
  {
    type: "collapse",
    name: "Accueil",
    key: "tableau-de-bord",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: `/dashboard/:userRole`,
    component: <Dashboard />,
  },
  
  {
    type: "collapse",
    name: "Réseau",
    key: "reseau",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/reseau",
    component: <Network />,
  },
 
  {
    type: "collapse",
    name: "Chat",
    key: "chat",
    icon: <Icon fontSize="small">chat</Icon>,
    route: "/chat",
    component: <ChatManagement />,
  },
  {
    type: "collapse",
    name: "Entretien",
    key: "entretien",
    icon: <Icon fontSize="small">co_present</Icon>,
    route: "/entretien",
    component: <Interview />,
  },
  {
    type: "route",
    name: "Calendrier", 
    key: "calendrier", 
    route: "/calendrier", 
    component: <Calendrier />, 
  },
  

{
  type: "collapse",
   name: "Feedback",
    key: "Feedback",
    icon: <Icon fontSize="small">star_half</Icon>,
    route: "/Feedback",
    component: <Feedback />,
  },
  {
    type: "route",
    name: "meet", 
    key: "meet", 
    route: "/meet", 
    component: <Meet />, 
  },
  
  {
    type: "collapse",
    name: "Profil",
    key: "profil",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profil",
    component: <Profile />,
  },
  {
    type: "route",
    name: "Candidature",
    key: "candidature",
    icon: <Icon fontSize="small">assignment</Icon>, // Icône mise à jour
    route: "/candidature/ajouter/:selectedOffer",
    component: <Candidacy />,
  },
  {
    type: "collapse",
    name: "Mes Candidatures",
    key: "mes-candidatures",
    icon: <Icon fontSize="small">assignment_turned_in</Icon>, // Icône mise à jour
    route: "/candidatures",
    component: <CandidatureCandidat />,
  },
  {
    type: "collapse",
    name: "Quiz",
    key: "quiz",
    icon: <Icon fontSize="small">help_outline</Icon>, // Icône mise à jour
    route: "/quiz",
    component: <QuizComponent />,
  }, 
  {
    type: "collapse",
    name: "Offres",
    key: "offres",
    icon: <Icon fontSize="small">local_offer</Icon>, // Icône mise à jour
    route: "/offre",
    component: <Offers/>,
  },
  
  {
    type: "collapse",
    name: "Connexion",
    key: "connexion",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Inscription",
    key: "inscription",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;


