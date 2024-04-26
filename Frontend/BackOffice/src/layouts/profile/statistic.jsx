/*eslint-disable*/import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Chart } from 'chart.js/auto';

function OfferStatistics() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatistics() {
            try {
                const response = await axios.get('http://localhost:5000/offer/statistics');

                if (response.status !== 200) {
                    throw new Error('Erreur lors de la récupération des statistiques');
                }

                const contentType = response.headers['content-type'];

                if (contentType && contentType.includes('application/json')) {
                    const { offersWithQuiz, offersWithoutQuiz } = response.data;

                    const newChartData = {
                        labels: ['Offres avec Quiz', 'Offres sans Quiz'],
                        datasets: [
                            {
                                label: 'Statistiques des offres',
                                data: [offersWithQuiz, offersWithoutQuiz],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                            },
                        ],
                    };

                    setChartData(newChartData);
                    setLoading(false);
                } else {
                    throw new Error('Réponse non JSON');
                }

            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setLoading(false);
            }
        }

        fetchStatistics();
    }, []);

    useEffect(() => {
        if (chartData) {
            const ctx = document.getElementById('statisticsChart');
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [chartData]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <h2>Statistiques des Offres</h2>
                <canvas id="statisticsChart" style={{ height: '400px' }}></canvas>
            </Paper>
        </DashboardLayout>
    );
}

export default OfferStatistics;
