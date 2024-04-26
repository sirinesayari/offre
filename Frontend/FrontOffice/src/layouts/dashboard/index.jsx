/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";

function Homepage() {
  const location = useLocation();
  const [randomImage, setRandomImage] = useState(null); // État pour stocker le nom de fichier de l'image aléatoire

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    if (userId) {
      sessionStorage.setItem("userId", userId);
    }

    // Liste des noms de fichier des images locales
    const localImages = [
      "image1.jpg",
      "image2.jpg",
      
      // Ajoutez plus de noms de fichier au besoin
    ];

    // Sélectionnez un nom de fichier d'image aléatoire lors du chargement du composant
    const randomIndex = Math.floor(Math.random() * localImages.length);
    setRandomImage(localImages[randomIndex]);
  }, [location]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <div style={{ textAlign: "center" }}>
          {/* Afficher l'image aléatoire */}
          {randomImage && (
            <img
              src={require(`../../img/${randomImage}`)}
              alt="Recruitment"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
         <h1>Bienvenue sur notre plateforme d'opportunités professionnelles</h1>
          <p>Ceci est la page d'accueil de notre application OpNet.</p>
          
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
              Naviger dans notre Plateforme
            </button>
          </Link>
        </div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Homepage;