import React, {useContext} from 'react';
import { Button } from 'antd';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
 


const Navbar = () => {
 
const { authProfil, getProfil }= useContext(authContext)


const { posts, getUserPosts, getUserLikePosts, getAllPosts } = useContext(postsContext)

  const disconnect = ()=>{
    localStorage.removeItem('token')
    getProfil()
    }
   
    return (
    <nav className='navBar'>
        <Button type="text" onClick={getAllPosts}>Tous les posts</Button>  
        <Button type="text" onClick= {getUserPosts}>Mes postes</Button>  
        <Button type="text" onClick={getUserLikePosts}>Mes favoris</Button>  
        <Button type="text" onClick={disconnect}>Se déconnecter</Button>  
    </nav>     

        
    );
};

export default Navbar;