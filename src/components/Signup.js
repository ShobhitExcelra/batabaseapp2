import * as React from "react";
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
import { Link } from "react-router-dom";

import Header from "./Header";
import Message from "./Message";
import Footer from "./Footer";
const defaultTheme = createTheme();
export default function Signup() {
  let [message,setMessage] = useState('')
  let [severity,setSeverity] = useState('');
  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "must have 8 characters!").required("Required"),
    confirmpassword: Yup.string()
      .required("Required")
      .min(8, "Password must have 8 characters")
      .oneOf(
        [Yup.ref("password")],
        "Confirm Password and Passwords does not match"
      ),
  });
  const changeMessage = () => {
    setMessage('');
    setSeverity('')
  }
  return (
    <>
      <Header />
      {
        message !== '' && <Message 
        severity={severity}
        message={message}
        changeMessage={changeMessage}
        />
      }
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
       <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
       </Snackbar>  */}
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmpassword: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(values) => {
                // same shape as initial values
                let requestBody = {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                };
                axios
                  .post(`${process.env.REACT_APP_API_ROOT}/signup`, requestBody)
                  .then(function (response) {
                    setMessage("Please check your email to activate your account")
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
                    id="firstName"
                    class="input"
                    name="firstName"
                    placeholder="First Name"
                  />
                  <p class="errorMessage">
                    {errors.firstName && `First Name is ${errors.firstName}`}
                  </p>
                  <Field
                    id="lastName"
                    name="lastName"
                    class="input"
                    placeholder="Last Name"
                  />
                  <p class="errorMessage">
                    {errors.lastName && `Last Name is ${errors.lastName}`}
                  </p>

                  <Field
                    id="email"
                    name="email"
                    class="input"
                    placeholder="Email"
                    type="email"
                  />
                  <p class="errorMessage">
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

                  <Field
                    id="confirmpassword"
                    name="confirmpassword"
                    class="input"
                    placeholder="Confirm Password"
                    type="password"
                  />
                  <p class="errorMessage">
                    {errors.confirmpassword && `${errors.confirmpassword}`}
                  </p>

                  
                  <div style={{display:'flex', justifyContent:'space-around'}}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{ marginLeft: "10px" }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    style={{ marginLeft: "10px" }}
                  >
                  <Link to="/home" style={{textDecoration:'none', color:'white'}}>
                       Cancel
                  </Link>
                  </Button>
                  {/* <Button
                    type="button"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Cancel
                  </Button> */}
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer/>

    </>
  );
}
