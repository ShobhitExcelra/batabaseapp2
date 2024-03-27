import React from 'react'
import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';

const Message = (props) => {
    useEffect(()=>{
      handleClick({ vertical: "top", horizontal: "center", severity:props.severity, message:props.message });
    },[])
    const [state, setState] = useState({
        open: false,
        vertical: "top",
        horizontal: "center",
        severity:"",
        message:""
      });
      const { vertical, horizontal, open, severity, message } = state;
      const handleClick = (newState) => {
        setState({ ...newState, open: true });
      };
    
      const handleClose = () => {
        setState({ ...state, open: false });
        props.changeMessage()
      };  

  return (
    <div>
       <Snackbar open={open} autoHideDuration={9000} onClose={handleClose}>
       <Alert
          onClose={handleClose}
          severity={props.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
       </Snackbar> 
    </div>
  )
}

export default Message
