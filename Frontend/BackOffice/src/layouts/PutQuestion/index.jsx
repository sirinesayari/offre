/*eslint-disable*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
};

const inputStyles = {
  marginBottom: "20px",
  width: "100%",
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

const buttonStyles = {
  marginRight: "10px",
};

function ModifyQuestion() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [thematique, setThematique] = useState("");
  const [niveau, setNiveau] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/question/get/${id}`);
      const { text, options, correctOption, thematique, niveau } = response.data;
      setText(text);
      setOptions(options);
      setCorrectOption(correctOption);
      setThematique(thematique);
      setNiveau(niveau);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/question/update/${id}`, {
        text,
        options,
        correctOption,
        thematique,
        niveau,
      });
      console.log(response.data);
      alert("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <Card sx={{ mt: 4, mx: "auto", maxWidth: 900, p: 2 }}>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" mx={1} mt={1} p={2} mb={1} textAlign="center">
          <MDTypography variant="h6" fontWeight="medium" color="white" mt={1}>
            Modify Question
          </MDTypography>
        </MDBox>
        <MDBox style={containerStyles}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <MDInput
              type="text"
              label="Question"
              variant="standard"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={inputStyles}
              required
            />
            {options.map((option, index) => (
              <MDInput
                key={index}
                type="text"
                label={`Option ${index + 1}`}
                variant="standard"
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={inputStyles}
                required
              />
            ))}
            <MDInput
              type="select"
              label="Correct Option"
              variant="standard"
              fullWidth
              value={correctOption}
              onChange={(e) => setCorrectOption(parseInt(e.target.value))}
              style={inputStyles}
              required
            >
              {options.map((option, index) => (
                <option key={index} value={index}>
                  {`Option ${index + 1}`}
                </option>
              ))}
            </MDInput>
            <MDInput
              type="text"
              label="Thematique"
              variant="standard"
              fullWidth
              value={thematique}
              onChange={(e) => setThematique(e.target.value)}
              style={inputStyles}
              required
            />
            <MDInput
              type="text"
              label="Niveau"
              variant="standard"
              fullWidth
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              style={inputStyles}
              required
            />
            <div style={buttonContainerStyles}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                style={buttonStyles}
              >
                Update Question
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                component={Link}
                to="/Question"
                style={buttonStyles}
              >
                Retour
              </MDButton>
            </div>
          </form>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default ModifyQuestion;
