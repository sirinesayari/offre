/* eslint-disable */
import { useEffect, useState } from "react";
import axios from "axios";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/network/Header/index";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import API_URLS from "apiUrls";

function ProfileN() {
  const [userInfo, setUserInfo] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(API_URLS.getUserById(userId));
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        {userInfo && (
          <>
            <div style={containerStyle}>
              <div style={columnStyle}>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Contact</h3>
                  <p><strong>Téléphone:</strong> <span style={textStyle}>{userInfo.phone}</span></p>
                  <p><strong>Email:</strong> <span style={textStyle}>{userInfo.email}</span></p>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Information de Profile</h3>
                  <p><strong>Date de naissance:</strong> <span style={textStyle}>{userInfo.dateOfBirth}</span></p>
                  <p><strong>Pays:</strong> <span style={textStyle}>{userInfo.country}</span></p>
                  <p><strong>Langues:</strong> <span style={textStyle}>{userInfo.languages}</span></p>
                </div>
                <div>
                  <h2>Mon CV</h2>
                  
                  <img src={userInfo.cV}  />

                </div>
              </div>
              <div style={columnStyle}>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>À propos</h3>
                  <p style={textStyle}>{userInfo.description}</p>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Éxperience</h3>
                  <p style={textStyle}>{userInfo.experience}</p>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Éducation</h3>
                  <p style={textStyle}>{userInfo.formation}</p>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Compétences</h3>
                  <p style={textStyle}>{userInfo.skills}</p>
                </div>
                <div style={sectionStyle}>
                  <h3 style={headingStyle}>Certificats</h3>
                  <p style={textStyle}>{userInfo.certificates}</p>
                </div>
              </div>
            </div>
          </>
        )}
         <Link to="/Network">
          <Button variant="contained"  size="small"   style={{ marginLeft: '10px', backgroundColor: '#E82227', color: 'white' }} 
>
            Retour
          </Button>
        </Link>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-start",
};

const columnStyle = {
  flex: "1",
  minWidth: "50%",
};

const sectionStyle = {
  marginBottom: "20px",
  padding: "20px",
  background: "#f9f9f9",
  borderRadius: "5px",
  margin: "10px"
};

const headingStyle = {
  marginBottom: "10px",
  color: "#333",
};

const textStyle = {
  color: "#555",
  fontSize: "16px"
};

export default ProfileN;
