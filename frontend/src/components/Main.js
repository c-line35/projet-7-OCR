import React, { useContext, useEffect } from 'react';
import Posts from './Posts';
import { authContext } from '../context/AuthContext';
import Tab from './Tab';
import PostsContextProvider from '../context/PostsContext';
import 'antd/dist/antd.variable.min.css';
import { ConfigProvider } from 'antd';


const Main = () => {

    ConfigProvider.config({ theme: { 
        primaryColor: "#fd2d01"
    } });

const { authProfil, getProfil, token } = useContext(authContext)

useEffect(()=>{
    getProfil()
}, [token])




    return (
        <ConfigProvider>
        <div>
            {authProfil?
            <PostsContextProvider>
                <Posts/>
            </PostsContextProvider>
            :<Tab />}
        </div>
        </ConfigProvider>
    );
};

export default Main;