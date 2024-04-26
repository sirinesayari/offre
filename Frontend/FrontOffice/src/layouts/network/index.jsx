/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import './styles.css';
import API_URLS from "apiUrls";

const useStyles = makeStyles((theme) => ({
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  profileImage: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(1),
  },
  userName: {
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
}));

function Network() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [sortBy, setSortBy] = useState(""); // State to store the sorting criterion
  const [sortOrder, setSortOrder] = useState(""); // State to store the sorting order
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // Number of users per page

  // Function to handle user sorting
  const handleSort = async () => {
    try {
      const response = await axios.post(API_URLS.sortUsers, {
        sortBy,
        sortOrder,
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error("Error sorting users:", error);
      setError("An error occurred while sorting users");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URLS.getAllUsers);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const handleContact = async (userId) => {
    try {
      const senderId = window.sessionStorage.getItem('userId');
      const updatedChatData = {
        senderId: senderId,
        receiverId: userId,
      };

      const response = await axios.post(API_URLS.createChat, updatedChatData);
      // No need to navigate programmatically, handle navigation using Link
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(API_URLS.searchUsers, {
        firstname: searchQuery,
        lastname: searchQuery,
        speciality: searchQuery,
        email: searchQuery,
        institution: searchQuery,
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("An error occurred while searching users");
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
<DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Rechercher"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small" // Réduction de la taille
              />
            </Grid>
            {/* Bouton de recherche */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#E82227', color: 'white' }}
                onClick={handleSearch}
                fullWidth
              >
                Rechercher
              </Button>
            </Grid>
            {/* Menu déroulant pour trier */}
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={['firstname', 'lastname', 'speciality', 'institution']}
                value={sortBy}
                onChange={(event, newValue) => {
                  setSortBy(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Trier par"
                    variant="outlined"
                    fullWidth
                    size="small" // Réduction de la taille
                  />
                )}
              />
            </Grid>
            {/* Menu déroulant pour l'ordre de tri */}
            <Grid item xs={12} sm={6} md={2}>
              <Autocomplete
                options={['asc', 'desc']}
                value={sortOrder}
                onChange={(event, newValue) => {
                  setSortOrder(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ordre"
                    variant="outlined"
                    fullWidth
                    size="small" // Réduction de la taille
                  />
                )}
              />
            </Grid>
            {/* Bouton de tri */}
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#E82227', color: 'white' }}
                onClick={handleSort}
                fullWidth
              >
                Trier
              </Button>
            </Grid>


          </Grid>
          <Grid container spacing={2}>
            {currentUsers.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div className={classes.userContainer}>
                  <Avatar src={user.profileImage} alt="Profile" className={classes.profileImage} />
                  <Typography variant="subtitle2" className={classes.userName}>{user.firstname} {user.lastname}</Typography>
                  <Typography variant="body2"><strong>Specialité:</strong> {user.speciality}</Typography>
                  <div className={classes.buttonContainer}>
                    <Button size="small" variant="contained" color="primary">
                      <Link to={`/user/${user._id}`} style={{ textDecoration: "none", color: "white" }}>Voir Profil</Link>
                    </Button>
                    <Button size="small" component={Link} to={`/Chat`} onClick={() => handleContact(user._id)} variant="contained" style={{ marginLeft: 8, backgroundColor: '#E82227', color: 'white' }}>
                      Contacter
                    </Button>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            usersPerPage={usersPerPage}
            totalUsers={users.length}
            onPageChange={handlePageChange}
          />
          {error && <div>Error: {error}</div>}
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

// Pagination component
const Pagination = ({ currentPage, usersPerPage, totalUsers, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Network;

