/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CircularProgress, Paper } from '@material-ui/core';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Chart } from 'chart.js/auto';

function OfferStatistics() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null); // Référence pour le canvas du graphique

    useEffect(() => {
        async function fetchStatistics() {
            try {
                const response = await axios.get('http://localhost:5000/offer/statistics-by-type');

                if (response.status !== 200) {
                    throw new Error('Erreur lors de la récupération des statistiques');
                }

                const contentType = response.headers['content-type'];

                if (contentType && contentType.includes('application/json')) {
                    const { emploiCount, stageCount, cdiCount, cddCount, freelanceCount } = response.data;

                    const newChartData = {
                        labels: ['Type d offre:Emploi', 'Type d offre:Stage', 'Type de contrat:CDI', 'Type de contrat:CDD', 'Type de contrat:Freelance'],
                        datasets: [
                            {
                                label: 'Statistiques des offres par type',
                                data: [emploiCount, stageCount, cdiCount, cddCount, freelanceCount],
                                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
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
            // Détruire le graphique existant s'il y en a un
            if (chartRef.current !== null) {
                chartRef.current.destroy();
            }
            const ctx = document.getElementById('statisticsChart');
            chartRef.current = new Chart(ctx, {
                type: 'pie', // Utiliser un graphique en forme de cercle
                data: chartData,
                options: {
                    plugins: {
                        legend: {
                            position: 'right', // Position de la légende
                        },
                        title: {
                            display: true,
                            text: 'Statistiques des Offres',
                            font: {
                                textAlign: 'center',
                                size: 18 // Taille du titre
                            }
                        }
                    },
                    aspectRatio: 3, // Ratio de l'aspect, ici 1 pour un cercle parfait
                },
            });
        }
    }, [chartData]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <DashboardLayout>
            <Paper elevation={1} style={{ padding: '10px', marginTop: '10px' }}>
                <canvas id="statisticsChart" style={{ height: '100px' }}></canvas>
            </Paper>
        </DashboardLayout>
    );
}

export default OfferStatistics;
