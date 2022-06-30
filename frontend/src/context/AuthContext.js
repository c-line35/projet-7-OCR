import React, { useEffect, useState } from "react";
import axios from 'axios';

 //création d'un context qui donne accès aux données de l'utilisateur à tous les composents
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

// récupération du token dans le local storage
    const initToken = ()=>{
        setToken(localStorage.getItem('token'));
    }  
//configuration des requêtes
  const reqInstance = axios.create({
        headers:{
            Authorization: `Bearer ${token}`,
        },
        baseURL: 'http://localhost:3001/api'
            })
//requête pour récupérer les données de l'utilisateur à partir du token
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
