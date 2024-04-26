/*eslint-disable*/
import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const Home = () => (
    <DashboardLayout>
    <Fragment>
        <Helmet><title>Home - Quiz App</title></Helmet>
        <div id="home">
            <section>
                <div style={{ textAlign: 'center' }}>
                    <span className="mdi mdi-cube-outline cube"></span>
                </div>
                <h1>Quiz </h1>
                <div className="play-button-container">
                    <ul>
                        <li>
                            <Link
                                className="play-button"
                                to="/play/instructions"
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    textDecoration: 'none'
                                }}
                            >
                                Démarrer
                            </Link>
                        </li>
                    </ul>
                </div>
               
            </section>
        </div>
    </Fragment>
    </DashboardLayout>
);

export default Home;
