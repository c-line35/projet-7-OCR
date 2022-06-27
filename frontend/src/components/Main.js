import React, { useContext, useEffect } from 'react';
import Posts from './Posts';
import { authContext } from '../context/AuthContext';
import Tab from './Tab';
import PostsContextProvider from '../context/PostsContext';

const Main = () => {

const { authProfil, getProfil, token } = useContext(authContext)

useEffect(()=>{
    getProfil()
}, [token])




    return (
        <div>
            {authProfil?
            <PostsContextProvider>
                <Posts/>
            </PostsContextProvider>
            :<Tab />}
        </div>
    );
};

export default Main;