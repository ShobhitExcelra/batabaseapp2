import React from 'react'
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import Message from "./Message";
import Footer from './Footer';
const defaultTheme = createTheme();

const ForgotPassword = () => {
    let [message,setMessage] = useState('')
    let [severity,setSeverity] = useState('');
    const ForgotPasswordSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
    });
    const changeMessage = () => {
      setMessage('');
      setSeverity('')
    }  
  return (
    <div>
        <Header/>
        {
        message !== '' && <Message 
        severity={severity}
        message={message}
        changeMessage={changeMessage}
        />
      }
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={(values) => {
                // same shape as initial values
                let requestBody = {
                  email: values.email,
                };
                axios
                  .post(`${process.env.REACT_APP_API_ROOT}/users/password-reset`, requestBody)
                  .then(function (response) {
                    setMessage("Please check your email to reset your password")
                    setSeverity("success")
                  })
                  .catch(function (error) {
                    setMessage(error.response.data.error.message)
                    setSeverity("error")
                  });
              }}
            >
              {({ errors, touched }) => (
                <Form>
                 <Field
                    id="email"
                    name="email"
                    className="input"
                    placeholder="Email"
                    type="email"
                  />
                  <p className="errorMessage">
                    {errors.email && `Email is ${errors.email}`}
                  </p>


                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{ marginLeft: "75px" }}
                  >
                    Send Email
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
        </ThemeProvider>
        <Footer/>
    </div>
  )
}

export default ForgotPassword
