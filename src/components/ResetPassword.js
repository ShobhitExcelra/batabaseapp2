import React from 'react'
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
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
const ResetPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    let [message,setMessage] = useState('')
    let [severity,setSeverity] = useState('');
    let token = searchParams.get('token');
    const ForgotPasswordSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(8, "must have 8 characters!").required("Required"),
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
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={(values) => {
                // same shape as initial values
                let requestBody = {
                  email: values.email,
                  password: values.password,
                  token
                };
                axios
                  .post(`${process.env.REACT_APP_API_ROOT}/users/confirm-password-reset`, requestBody)
                  .then(function (response) {
                    setMessage("Your password has been reset. You can log in to your account with your new password")
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

                  <Field
                    id="password"
                    name="password"
                    class="input"
                    placeholder="Password"
                    type="password"
                  />
                  <p class="errorMessage">
                    {errors.password && `Password is ${errors.password}`}
                  </p>  

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{ marginLeft: "75px" }}
                  >
                    Reset Password
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

export default ResetPassword
