/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
/* eslint-disable */
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-reset-cover.jpg";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import API_URLS from "../../../apiUrls";

function PasswordReset() {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  
  const param = useParams();
  const url = `http://localhost:5000/password-reset/${param.id}/${param.token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param, url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data  } = await axios.post(url, { password });
      setMsg(data.message);
      setError("");
      window.location = "/authentication/sign-in";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {validUrl ? (
            <form onSubmit={handleSubmit}>
              <MDBox mb={4}>
                <MDInput
                  type="password"
                  label="Password"
                  variant="standard"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                {error && (
                  <div className={styles.error_msg}>{error}</div>
                )}
                {msg && <div className={styles.success_msg}>{msg}</div>}

                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="submit"
                >
                  Reset
                </MDButton>
              </MDBox>
            </form>
          ) : (
            <MDTypography variant="h5" color="error">
              404 Not Found
            </MDTypography>
          )}
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default PasswordReset;
