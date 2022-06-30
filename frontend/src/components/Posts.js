import React, { useContext, useEffect} from 'react';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
import Navbar from './Navbar';
import NewPost from './NewPost';
import Post from './Post';
import { BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';


//style du bouton 'retour en haut de page'
const style = {
  height: 20,
  width: 20,
  lineHeight: '20px',
  borderRadius: 4,
  backgroundColor: '#4e5166',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

const posts = () => {

//récupération des données des posts pour les envoyer dans chaque composents post
  const { posts, getAllPosts }=useContext(postsContext)

//récupération des données de l'utilisateur connecté
  const { authProfil }=useContext(authContext)
  const { pseudo }= authProfil

useEffect(()=>{
  getAllPosts()
},[])

  return (
    <div>
      <div className='welcome'>Bienvenu { pseudo }</div>
      <NewPost />
      <Navbar />
      <div className="posts">
        {posts
        .sort((a, b)=>b.id - a.id)
        .map((post)=>(<Post key={post.id} post={post} />))}
      </div>
      <BackTop>
        <div style={style}><ArrowUpOutlined /></div>
      </BackTop>
    </div>   
    );
};

export default posts;