/* eslint-disable */
import React,{ useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";



function Homepage() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  useEffect(() => {
    
    const userId = getCookie("userId");
    console.log(userId);
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <div style={{ textAlign: "center" }}>
          <h1>Welcome to Our Professional Opportunities Platform</h1>
          <p>This is the homepage of your dashboard application.</p>
          <p>Here are some things you can do:</p>
          
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
              Go to Dashboard
            </button>
          </Link>
        </div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Homepage;