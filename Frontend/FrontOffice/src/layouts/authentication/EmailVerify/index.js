/* eslint-disable */
import React, { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../../assets/images/succes.png";
import styles from "./styles.module.css";
import API_URLS from "../../../apiUrls";

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const url = `http://localhost:5000/user/${param.id}/verify/${param.token}`;
                
                const { data } = await axios.get(url);
                console.log("Verification Response:", data); // Add console log here
                setValidUrl(true);
            } catch (error) {
                console.error("Verification Error:", error); // Add console error log here
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param]);

    return (
        <Fragment>
            {validUrl ? (
                <div className={styles.container}>
                    <img src={success} alt="success_img" className={styles.success_img} />
                    <h1>Email verified successfully</h1>
                    <Link to="/login">
						<button className={styles.green_btn}>Login</button>
					</Link>
                </div>
            ) : (
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default EmailVerify;
