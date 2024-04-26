/* eslint-disable */
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

function Forminput({ interviewId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [selectedTypeRencontre, setSelectedTypeRencontre] = useState("En ligne");
    const [selectedTypeIntrv, setSelectedTypeIntrv] = useState("Entretien avec le RH");
    const [formError, setFormError] = useState("");

    const [touchedFields, setTouchedFields] = useState({
        title: false,
        description: false,
        candidateName: false,
        address: false,
        date: false
    });
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const userId = getCookie("userId");
    useEffect(() => {
        if (interviewId) {
            axios.get(`http://localhost:5000/interviews/get/${interviewId}`)
                .then(response => {
                    const { title, descrInter, assignedStudentName, address, dateInterv, typeRencontre, typeIntrv } = response.data;
                    setTitle(title);
                    setDescription(descrInter);
                    setCandidateName(assignedStudentName);
                    setAddress(address);
                    setSelectedDate(formatDateForInput(dateInterv));
                    setSelectedTypeRencontre(typeRencontre);
                    setSelectedTypeIntrv(typeIntrv);
                })
                .catch(error => {
                    console.error("Error fetching interview details:", error);
                });
        }
    }, [interviewId]);

    const handleInputBlur = (field) => {
        setTouchedFields((prevState) => ({
            ...prevState,
            [field]: true
        }));
    };

    const handleDateChange = (e) => {
        const currentDate = new Date();
        const selectedDate = new Date(e.target.value);

        if (selectedDate < currentDate) {
            setDateError("La date d'entretien ne peut pas être antérieure à la date actuelle.");
        } else {
            setDateError("");
        }

        setSelectedDate(e.target.value);
        handleInputBlur('date');
    };

    const handleAddInterview = () => {
        if (!title || !description || !candidateName || !address || !selectedDate) {
            setFormError("Veuillez remplir tous les champs obligatoires du formulaire.");
            return;
        } else {
            setFormError(""); 
        }
        const newInterview = {
            title,
            descrInter: description, 
            assignedStudentName: candidateName, 
            address,
            dateInterv: selectedDate,
            typeRencontre: selectedTypeRencontre,
            typeIntrv: selectedTypeIntrv
        };
    
        axios.post(`http://localhost:5000/interviews/add/${userId}`, newInterview)
            .then(response => {
                console.log("Interview added successfully:", response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error("Error adding interview:", error);
            });
    };
    
    const handleUpdateInterview = () => {
        if (!title || !description || !candidateName || !address || !selectedDate) {
            setFormError("Veuillez remplir tous les champs obligatoires du formulaire.");
            return;
        } else {
            setFormError("");
        }

        const updatedInterview = {
            title,
            descrInter: description,
            assignedStudentName: candidateName,
            address,
            dateInterv: selectedDate,
            typeRencontre: selectedTypeRencontre,
            typeIntrv: selectedTypeIntrv
        };

        axios.put(`http://localhost:5000/interviews/update/${interviewId}`, updatedInterview)
            .then(response => {
                console.log("Interview updated successfully:", response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error("Error updating interview:", error);
            });
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toISOString().slice(0, 16);
        return formattedDate;
    };

    return (
            <MDBox >
                <Box 
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { ml:"25%", my: 1, width: '50%' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Titre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => handleInputBlur('title')}
                            helperText={!title && touchedFields.title ? "Le titre est obligatoire" : ""}
                            error={!title && touchedFields.title}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => handleInputBlur('description')}
                            helperText={!description && touchedFields.description ? "La description est obligatoire" : ""}
                            error={!description && touchedFields.description}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Nom du candidat"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            onBlur={() => handleInputBlur('candidateName')}
                            helperText={!candidateName && touchedFields.candidateName ? "c'est obligatoire d'entrer le nom d'un candidat" : ""}
                            error={!candidateName && touchedFields.candidateName}
                        />
                        <TextField
                            required
                            type="datetime-local"
                            id="outlined-required"
                            value={selectedDate}
                            onChange={handleDateChange}
                            error={!!dateError}
                            helperText={dateError}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Adresse"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onBlur={() => handleInputBlur('address')}
                            helperText={!address && touchedFields.address ? "L'adresse est obligatoire" : ""}
                            error={!address && touchedFields.address}
                        />

                        <TextField
                            required
                            id="outlined-select-currency-native"
                            select
                            label="Type rencontre"
                            value={selectedTypeRencontre}
                            onChange={(e) => setSelectedTypeRencontre(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="En ligne" >En ligne</option>
                            <option value="En face">En face</option>
                        </TextField>
                        <TextField
                            required
                            id="outlined-select-currency-native"
                            select
                            label="Type entretien"
                            value={selectedTypeIntrv}
                            onChange={(e) => setSelectedTypeIntrv(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="Entretien avec le RH" >Entretien avec le RH </option>
                            <option value="Entretien technique">Entretien technique </option>
                            <option value="Entretien psychologique">Entretien psychologique </option>
                        </TextField>
                        {formError && <Typography style={{ fontWeight: "100" , fontSize: "12px" , marginLeft:"21%"}} color="error">{formError}</Typography>}
                    </div>
                    <Button variant="contained" style={{backgroundColor:"red" , color: 'white' , marginTop:"23px", marginLeft:"40%"}} onClick={interviewId ? handleUpdateInterview : handleAddInterview} >
                        {interviewId ? "Modifier" : "Ajouter"}
                    </Button>
                </Box>
            </MDBox>
            
    );
}

export default Forminput;
