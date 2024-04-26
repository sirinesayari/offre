/*eslint-disable*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Header from "layouts/profile/components/Header";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";

const containerStyles = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const buttonStyles = {
  cursor: "pointer",
  marginRight: "5px",
};

const searchInputStyles = {
  padding: "12px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
  flex: "1",
};

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

const modalContentStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  border: "2px solid #000",
  padding: "20px",
};

function GetQuestion() {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, [currentPage]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/question/getall");
      setQuestions(response.data.map(question => ({ ...question, showOptions: false })));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const toggleShowOptions = (options) => {
    setSelectedOptions(options);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log("Effectuer une recherche avec le terme:", searchTerm);
  };

  const filteredQuestions = questions.filter(question =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        mt={1}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Liste Des Questions
        </MDTypography>
      </MDBox>
      <MDBox mt={8}>
        <MDBox mb={3} style={containerStyles}>
          <MDButton
            variant="gradient"
            color="info"
            component={Link}
            to="/question/ajouter"
            style={buttonStyles}
          >
            Ajouter une question
          </MDButton>
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={searchInputStyles}
          />
         
        </MDBox>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={headerStyles}>Question</th>
              <th style={headerStyles}>Options</th>
              <th style={headerStyles}>Thématique</th>
              <th style={headerStyles}>Niveau</th>
              <th style={headerStyles}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((question, index) => (
                <tr key={index} style={index % 2 === 0 ? evenRowStyles : {}}>
                  <td style={cellStyles}>{question.text}</td>
                  <td style={cellStyles}>
                    <MDButton
                      variant="gradient"
                      color="secondary"
                      style={buttonStyles}
                      onClick={() => toggleShowOptions(question.options)}
                    >
                      Voir options
                    </MDButton>
                  </td>
                  <td style={cellStyles}>{question.thematique}</td>
                  <td style={cellStyles}>{question.niveau}</td>
                  <td style={{ ...cellStyles, ...containerStyles }}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      style={buttonStyles}
                      component={Link}
                      to={`/modifier/${question._id}`}
                    >
                      Modifier
                    </MDButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </MDBox>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card style={modalContentStyles}>
          <MDTypography variant="h6">Options</MDTypography>
          {selectedOptions.map((option, index) => (
            <div key={index}>{`Option ${index + 1}: ${option}`}</div>
          ))}
          <MDButton
            variant="gradient"
            color="info"
            style={buttonStyles}
            onClick={handleCloseModal}
          >
            Fermer
          </MDButton>
        </Card>
      </Modal>
       {/* Pagination */}
       <MDBox display="flex" justifyContent="center" mt={3}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={prevPage}
          disabled={currentPage === 1} // Désactiver le bouton s'il n'y a pas de page précédente
          style={{ marginRight: "10px" }}
        >
          Page Précédente
        </MDButton>
        <MDButton
          variant="gradient"
          color="info"
          onClick={nextPage}
          disabled={currentPage === totalPages} // Désactiver le bouton s'il n'y a pas de page suivante
          style={{ marginLeft: "10px" }}
        >
          Page Suivante
        </MDButton>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default GetQuestion;