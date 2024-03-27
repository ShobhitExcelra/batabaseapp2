import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Message from "./Message";
import axios from "axios";
import { Link } from "react-router-dom";
import { Switch } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginRequest } from "../config/authConfig";
import { useMsal } from "@azure/msal-react";
import Header from "./Header";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addBatabase } from "../utils/batabaseSlice";
import Footer from "./Footer";
const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  let [emailError, setEmailError] = useState(false);
  let [passwordError, setPasswordError] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message,setMessage] = useState('')
  let [severity,setSeverity] = useState('');
  let [switchView,setSwitchView] = useState(false)
  let [loading,setLoading] = useState(false);
  const { instance } = useMsal();
  const handleLogin = (event) => {
    instance.loginRedirect(loginRequest);
  };
  const changeMessage = () => {
    setMessage('');
    setSeverity('')
  }
  const changeView = () => {
    setSwitchView(!switchView)
  }
  
  const handleCustomLogin = (event) => {
    let requestBody = {email: email, password: password};
    if(email === ''){
      setEmailError(true);
    }
    else if(!(/^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/.test(email))){
      setEmailError(true);
    }
    else if(password === ''){
      setPasswordError(true)
    }
    else{
      setEmailError(false)
      setPasswordError(false)
      setLoading(true)
      axios
      .post(`${process.env.REACT_APP_API_ROOT}/users/login`, requestBody)
      .then(function (response) {
        
        // Call the batabase API
        axios
          .get(`${process.env.REACT_APP_API_ROOT}/batabases`, {
            headers: {
              accept: "application/json",
              authorization: response.data.idToken,
            },
          })
          .then((result) => {
            localStorage.setItem(
              "batabaseAPI",
              btoa(JSON.stringify(result.data))
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            setLoading(false)
            dispatch(addUser({ idToken: response.data.idToken }));
            dispatch(addBatabase({ batabaseAPI: result.data }));
            
          })
          .catch((err)=>{
            setLoading(false)
            console.log(err);
          })
      })
      .catch(function (error) {
        setLoading(false)
        setMessage(error.response.data.error.message)
        setSeverity("error")
      });
    }
    
  };
  const captureEmail = (event) => {
    setEmail(event.target.value)
    setEmailError(false)
  }
  const capturePassword = (event) => {
    setPassword(event.target.value)
    setPasswordError(false)
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
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">

          <CssBaseline />
          <Box
            sx={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <div style={{display:'flex'}}><h4>Paratus User</h4><div className="switchButton" style={{paddingTop:'14px'}}><Switch onChange={changeView} /></div><h4>Partner</h4></div>
            {loading &&  <Box sx={{ display: 'flex' }}>
              <CircularProgress size={100} />
            </Box>}
            <form onSubmit={(e) => e.preventDefault()}>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                {switchView ?
                <>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  required={true}
                  onChange={(event) => captureEmail(event)}
                  size="small"
                />
                <p class="errorMessage">
                    {emailError  && 'Please enter valid email address'}
                  </p>
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  size="small"
                  required
                  onChange={(event) => capturePassword(event)}
                  onKeyUp={(event)=>{
                    if (event.key === 'Enter') {
                      // Do code here
                      handleCustomLogin();
                    }
                  }}
                />
                <p class="errorMessage">
                    {passwordError  && 'Password is required'}
                  </p>
                {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ml:8 }}
                  onClick={(event) => handleCustomLogin()}
                  disabled={loading ? "disabled" : ""}
                >
                  Sign In
                </Button>
                </>
                :
                <>
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, ml:5 }}
                  onClick={(event) => handleLogin("redirect")}
                >
                  Sign In With Microsoft Account
                </Button>
                </>
                }
                {/* {switchView && 
                <Grid container>
                  <Grid item xs>
                    <Link to="/forgotpassword" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                } */}
              </Box>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer/>
    </>
  );
}
