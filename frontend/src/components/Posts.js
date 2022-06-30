import React, { useContext, useEffect} from 'react';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
import Navbar from './Navbar';
import NewPost from './NewPost';
import Post from './Post';
import { BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const style = {
  height: 20,
  width: 20,
  lineHeight: '20px',
  borderRadius: 4,
  backgroundColor: '#ffd7d7',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};

const posts = () => {
  const { posts, getAllPosts }=useContext(postsContext)
  const { authProfil }=useContext(authContext)
  const { pseudo }= authProfil

useEffect(()=>{
  getAllPosts()
},[])

  return (
    <div>
      <h1>Bienvenu { pseudo }</h1>
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