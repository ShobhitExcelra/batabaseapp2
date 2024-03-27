import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom';
import Message from './Message';

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    let [message,setMessage] = useState('')
    let [severity,setSeverity] = useState('');
    let token = searchParams.get('token');
    useEffect(()=>{
        axios
        .get(`${process.env.REACT_APP_API_ROOT}/users/verify/${token}`, {
        headers: {
            accept: "application/json",
        },
        })
        .then((result) => {
            setMessage("Your email is verified now. You can login in to batabase application")
            setSeverity("success")
        })
        .catch((err)=>{
            setMessage("Some Error Occured")
            setSeverity("error")
        });   
    },[])  
    const changeMessage = () => {
        setMessage('');
        setSeverity('')
      }  
  return (
    <>
    {message === '' ? <div className='loader'></div> : 
    <Message 
        severity={severity}
        message={message}
        changeMessage={changeMessage}
    />
    }
    </>
  )
}

export default Verify
