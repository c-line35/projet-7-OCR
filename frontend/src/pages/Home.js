
import AuthContextProvider from '../context/AuthContext';
import 'antd/dist/antd.min.css';
import Header from '../components/Header';
import Main from '../components/Main';
import React from 'react';


const Home = () => {

 
  return (
    <main>
    <Header />
    <AuthContextProvider  > 
      <Main />
    </AuthContextProvider> 
     
    
     

  </main>
       
  );
};

export default Home;