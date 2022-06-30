import React, { useEffect, useState } from "react";
import axios from 'axios';

export const authContext = React.createContext({
    user: null,
    reqInstance: null,
    getProfil: ()=>{},
    initToken:()=>{},
    isAdmin: false
});

const AuthContextProvider=({ children })=>{

    const [authProfil, setAuthProfil] = useState("");
    const[token, setToken]=useState('');


  useEffect(()=>{
    initToken()
  },[])


    const initToken = ()=>{
        setToken(localStorage.getItem('token'));
    }  
   
  const reqInstance = axios.create({
        headers:{
            Authorization: `Bearer ${token}`,
        },
        baseURL: 'http://localhost:3001/api'
            })

    const getProfil=()=>{
        {localStorage.length > 0
        ?reqInstance.get(`/auth/user/${token}`)
            .then((res)=>{
                setAuthProfil(res.data)})   
        :setAuthProfil('')
        }
    }
    
   
    return (
    
    <authContext.Provider value = { {authProfil, reqInstance, getProfil, initToken, token}  } >
        { children }
    </authContext.Provider>)
}

export default AuthContextProvider
