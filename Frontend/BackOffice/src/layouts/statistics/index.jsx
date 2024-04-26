/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Import MUI components
import Grid from "@mui/material/Grid";

// Import Material Dashboard 2 React components
import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import API_URLS from "apiUrls";

const StatisticsComponent = () => {

  const [roleStatistics, setRoleStatistics] = useState([]);
  const [candidatureStatistics, setCandidatureStatistics] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchData = async () => {
    try {
      const roleStatsResponse = await axios.get(API_URLS.userRoleStatistics);
      setRoleStatistics(roleStatsResponse.data);

      const candidatureResponse = await axios.get('http://localhost:5000/candidature/statistics');
      setCandidatureStatistics(candidatureResponse.data);

      const totalUsersResponse = await axios.get(API_URLS.totalUsers);
      setTotalUsers(totalUsersResponse.data.totalUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
// Fonction pour récupérer la valeur d'un cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}


  useEffect(() => {
    fetchData();
    // Récupérer userId et userRole depuis les cookies
const userId = getCookie("userId");
const userRole = getCookie("userRole");

console.log(userId);
  }, []);

  useEffect(() => {
    renderCharts();
  }, [roleStatistics, candidatureStatistics, totalUsers]);

  const renderCharts = () => {
    renderBarChartRole();
    renderBarChartCandidature();
  };

  const renderBarChartRole = () => {
    const ctx = document.getElementById("roleBarChart");
  
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
  
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: roleStatistics.map((stat) => stat._id),
          datasets: [
            {
              label: 'Role Count',
              data: roleStatistics.map((stat) => stat.count),
              backgroundColor: [
                "#FF5733", // Vivid Red
                "#E82227", // Dark Red
                "#FFAF9F", // Rose
                "#F99999", // Coral Red
                "#FA8072", // Light Salmon
                "#F08080", // Light Coral
              ],
              borderWidth: 2, // Border width of the pie slices
              borderColor: 'rgba(255, 255, 255, 0.5)', // Border color of the pie slices
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom', // Position the legend at the bottom
              labels: {
                boxWidth: 20, // Width of the legend colored boxes
                padding: 15, // Padding between legend items
                font: {
                  size: 14, // Font size of the legend labels
                },
              },
            },
            title: {
              display: true,
              text: 'Statistiques des rôles des utilisateurs', // Title of the pie chart
              font: {
                size: 18, // Font size of the title
                weight: 'bold', // Font weight of the title
              },
            },
          },
          radius: '90%', // Adjust the size of the pie chart here
          cutout: '50%', // Size of the center hole (set to '0%' for a regular pie)
          rotation: -0.5 * Math.PI, // Rotate the pie chart to start from the top
          responsive: true, // Make the chart responsive
          maintainAspectRatio: false, // Maintain aspect ratio when resizing
        },
      });
    }
  };
  
  const renderBarChartCandidature = () => {
    const ctx = document.getElementById("candidatureBarChart");
  
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
  
      // Check if candidatureStatistics is an object with the expected properties
      if (candidatureStatistics && typeof candidatureStatistics === 'object') {
        const { accepted, rejected, pending, archived } = candidatureStatistics;
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Accepted', 'Rejected', 'Pending', 'Archived'],
            datasets: [{
              label: 'Statistique de Candidature',
              data: [accepted, rejected, pending, archived],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}> {/* Remove top margin */}
        <MDBox mb={2} className="graph-container"> {/* Remove bottom margin */}
          <h2>Statistiques de Utilisateurs</h2>
          <p>Nombre total d'utilisateurs: {totalUsers}</p>
          <div className="graph-wrapper">
            <canvas id="roleBarChart"></canvas>
          </div>
        </MDBox>
        <MDBox mb={2} className="graph-container"> {/* Remove bottom margin */}
          <h2>Statistiques de Candidature</h2>
          <div className="graph-wrapper">
            <canvas id="candidatureBarChart"></canvas>
          </div>
        </MDBox>
      </MDBox>
     
      <Footer />
    </DashboardLayout>
  );
  
}

export default StatisticsComponent;
