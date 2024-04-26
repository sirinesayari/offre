/*eslint-disable*/
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import Footer from "examples/Footer";

const QuizInstructions = () => (
    <Fragment>
     <DashboardLayout>
      <Header />
        <Helmet><title>Quiz Instructions - Quiz App</title></Helmet>
        <div className="instructions container">
            <h1>Regles de quiz</h1>
            <p>Assurez-vous de lire ce guide du début à la fin!</p>
            <ul className="browser-default" id="main-list">
                <li>Le quiz dure 15 minutes et se termine dès que votre temps est écoulé.</li>
                <li>Chaque quiz se compose de 15 questions.</li>
               
                <li>N'hésitez pas à quitter le quiz à tout moment. Dans ce cas, votre score sera révélé ultérieurement.</li>
                <li>Le chronomètre démarre dès le chargement du quiz.</li>
                <li>Faisons-le si vous pensez avoir ce qu'il faut ?</li>
            </ul>
            <div>
                <span className="left"><Link to="/">Non, ramène-moi !</Link></span>
                <span className="right"><Link to="/play/quiz">D'accord, faisons ça !</Link></span>
            </div>
        </div>
        <Footer />
    </DashboardLayout>
    </Fragment>
);

export default QuizInstructions;