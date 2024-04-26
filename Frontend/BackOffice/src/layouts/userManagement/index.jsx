/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { Autocomplete, Grid, TextField } from "@mui/material";
import './styles.css';
import API_URLS from "apiUrls";
const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
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

const buttonStyles = {
  cursor: "pointer",
  marginRight: "5px",
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const usersPerPage = 5; 

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

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(API_URLS.deleteUser(userId));
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Rechercher"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
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
                    size="small"
                  />
                )}
              />
            </Grid>
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
                    size="small"
                  />
                )}
              />
            </Grid>
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
          <tbody>
              <tr>
                <td colSpan="8" style={cellStyles}>
                  <Button variant="contained" style={{ backgroundColor: '#E82227', color: '#fff' }}>
                    <Link to="/AddUser" style={{ textDecoration: "none", color: "white" }}>Ajouter Utilisateur</Link>
                  </Button>
                </td>
              </tr>
            </tbody>
          <table style={tableStyles}>
            
            <thead>
              <tr>
                <th style={headerStyles}>Prénom</th>
                <th style={headerStyles}>Nom</th>
                <th style={headerStyles}>Email</th>
                <th style={headerStyles}>Role</th>
                <th style={headerStyles}>Pays</th>
                <th style={headerStyles}>Téléfone</th>
                <th style={headerStyles}>Specialité</th>
                <th style={headerStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                
                <tr key={index} style={index % 2 === 0 ? evenRowStyles : {}}>
                  <td style={cellStyles}>{user.firstname}</td>
                  <td style={cellStyles}>{user.lastname}</td>
                  <td style={cellStyles}>{user.email}</td>
                  <td style={cellStyles}>{user.role}</td>
                  <td style={cellStyles}>{user.city}</td>
                  <td style={cellStyles}>{user.phone}</td>
                  <td style={cellStyles}>{user.speciality}</td>
                  <td style={{ ...cellStyles, ...buttonContainerStyles }}>
                    <Button size="small" variant="contained" color="primary" style={buttonStyles}>
                      <Link to={`/user/${user._id}`} style={{ textDecoration: "none", color: "white" }}>Détails</Link>
                    </Button>
                    <Button size="small" variant="contained" style={{ backgroundColor: '#E82227', color: '#fff', cursor: "pointer", marginRight: "5px" }}
                      onClick={() => handleDeleteUser(user._id)}>Suprimer</Button>
                      </td>
                      </tr>
                      ))}
                      </tbody>
                      </table>
                      {/* Pagination */}
                      <Pagination
                               currentPage={currentPage}
                               usersPerPage={usersPerPage}
                               totalUsers={users.length}
                               onPageChange={handlePageChange}
                             />
                      </MDBox>
                      </MDBox>
                      <Footer />
                      </DashboardLayout>
                      );
                      }
                      
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
                      
                      
                      export default UserManagement;
