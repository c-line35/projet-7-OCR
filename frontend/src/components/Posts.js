import React, { useContext, useEffect} from 'react';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
import Navbar from './Navbar';
import NewPost from './NewPost';
import Post from './Post';

const posts = () => {
  const { posts, getAllPosts }=useContext(postsContext)
  const { authProfil }=useContext(authContext)
  const { pseudo }= authProfil

useEffect(()=>{
  getAllPosts()
},[])

  return (
    <div>
      <h1>Bienvenu { pseudo }!!!</h1>
      <Navbar />
      <NewPost />
      <div className="posts">
        {posts
        .sort((a, b)=>b.id - a.id)
        .map((post)=>(<Post key={post.id} post={post} />))}
      </div>
    </div>   
    );
};

export default posts;