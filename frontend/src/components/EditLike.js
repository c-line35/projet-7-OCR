import React, {useState, useEffect, useContext} from 'react';
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import { Space } from 'antd';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';

const EditLike = ({ post }) => {
    const { id }= post

    const { authProfil, reqInstance} = useContext(authContext)
    const userId = authProfil.id;

    const { getAllPosts } = useContext(postsContext);

    const [like, setLike]=useState(false)

    useEffect(()=>{
        liked()
    }, [])

    const liked = ()=>{
      
        reqInstance.post(`http://localhost:3001/api/posts/liked/${userId}`,
        {postId: id})
            .then((res)=>{
                if(res.data.length === 0){
                    setLike(false)
                }else{
                    setLike(true)
                }
            })
        }
        
        const likePost = () =>{
            const data = {userId: userId}
            reqInstance.post(
                `/posts/${id}`,
                data
            )
            .then(()=>{
                getAllPosts()
                liked()
            })
        }

    return (
        <div>
            {!like
            ?<div className='post__edit__like' onClick={likePost}><LikeOutlined /></div>
            :<div className='post__edit__like' onClick={likePost}><Space><LikeTwoTone twoToneColor="red" /></Space></div>
            }
        </div>
    );
};

export default EditLike;