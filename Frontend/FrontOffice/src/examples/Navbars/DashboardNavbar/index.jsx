/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import queryString from "query-string";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import axios from "axios";
import API_URLS from "apiUrls";
import io from "socket.io-client";
import NotificationsIcon from "@mui/icons-material/Notifications";

const socket = io.connect("http://localhost:5000");

socket.on("connect", () => {
  console.log("Successfully connected!");
});
console.log(socket);

function DashboardNavbar({ absolute, light, isMini, searchInput, onSearchInputChange }) {
  let connectedUser = "";

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const route = location.pathname.split("/").slice(1);

  const setUserRole = (role) => {
    sessionStorage.setItem("userRole", role);
  };
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }
 

  const getNotificationByUser = async () => {
    const storedUserId = sessionStorage.getItem("userId");
    let notifications = [];
    try {
      console.log(storedUserId);
      const res = await axios
        .get(`http://localhost:5000/offer/notification/${storedUserId}`)
        .then((response) => {
          console.log("notifications", response.data);
          notifications = response.data.notifForDisplay;
          setNotifications(notifications);
        });
      console.log(notifications);
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  const getOfferbyId = async (offerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/offer/get/${offerId}`);
      
      const offre = response.data; 
      
      return offre;
    } catch (error) {
      console.error("Error fetching offer:", error);
      throw error; 
    }
  };
  
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
   
    socket.on("new-notif", async (notification) => {
      try {
        const offer = await getOfferbyId(notification.offre);
  
        if (!(notification.userId === storedUserId) && offer.user === storedUserId) {
          console.log("New notification:", notification);
          setNotifications((prevNotifications) => [...prevNotifications, notification]);
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    });
  
    socket.on("remove-notif", async (notification) => {
      try {
        const offer = await getOfferbyId(notification.offre);
        console.log("hello",offer);
  
        if (!(notification.userId === storedUserId) && offer.user === storedUserId) {
          console.log("Notification removed:", notification);
          setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif._id !== notification._id)
        );
        }
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    });
  
    getNotificationByUser();
  
    return () => {
      socket.off("remove-notif");
    };
  }, []);
  


  useEffect(() => {
    const checkUserRole = () => {
      const storedUserRole = sessionStorage.getItem("userRole");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      }
    };

    checkUserRole();

    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleLogout = () => {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userId");
  };

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    setHasNotifications(notifications.length > 0);
  }, [notifications]);
  const getNotificationIconColor = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: hasNotifications ? "#FF0000" : (transparentNavbar && !light) ? rgba(text.main, 0.6) : text.main,
  });

  const handleNotificationItemClick =async (clickedNotification) => {
    console.log("clicked notif",clickedNotification);
    try {
      //const response = await axios.delete(`http://localhost:5000/offer/deleteNotification/${clickedNotification._id}`);
      const response = await axios.put(`http://localhost:5000/offer/updateNotification/${clickedNotification._id}`);
       console.log("got here",response);
       setNotifications((prevNotifications) =>
       prevNotifications.filter((notification) => notification._id !== clickedNotification._id)

       );
      
      return response;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error; 
    }

    
  };
  

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {/* <NotificationItem icon={<Icon>email</Icon>} title="See Recieved Messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" /> */}
      {notifications.map((notification, index) => (
        <NotificationItem key={index}  icon={<NotificationsIcon />} title={notification.message} 
        onClick={() => handleNotificationItemClick(notification)}
        />
      ))}
    </Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Retrieve the userId from session storage
      const userId = sessionStorage.getItem("userId");

      // Retrieve the userRole from session storage
      const userRole = sessionStorage.getItem("userRole");

      // Store the userId and userRole in cookies
      document.cookie = `userId=${userId}; path=/`;
      document.cookie = `userRole=${userRole}; path=/`;
      // Redirect the user to the dashboard page
      window.location.href = "http://localhost:4000/dashboard";
      const user = sessionStorage.getItem("userId");
      console.log("user:", user);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {!isMini && (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Cherchez " value={searchInput} onChange={onSearchInputChange} />
            </MDBox>
            <MDBox>
              {["Admin", "Subadmin", "Entreprise", "Alumni"].includes(
                sessionStorage.getItem("userRole")
              ) && (
                <Button
                  variant="outlined"
                  style={{ backgroundColor: "#E82227", color: "#fff" }}
                  onClick={handleSignIn}
                >
                  Administration
                </Button>
              )}
              <Button onClick={handleLogout} component={Link} to="/authentication/sign-in">
                Se déconnecter
              </Button>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={getNotificationIconColor}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
