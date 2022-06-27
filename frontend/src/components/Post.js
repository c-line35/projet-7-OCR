import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
import EditLike from './EditLike';
import UpdatePost from './UpdatePost';
import { Button, Space } from 'antd';

const Post = ({ post }) => {
    const { id, content, image } = post
    const { authProfil, reqInstance} = useContext(authContext)
    const userId = authProfil.id
    const userRole = authProfil.role

const { getAllPosts } = useContext(postsContext)

const[myPost, setMyPost] = useState(false);
const [editContent, setEditContent] = useState("");
const [newImage, setNewImage]=useState("")



useEffect(()=>{
    isMyPost()
}, [])


const dateFormater = (date) =>{
    let newdate = new Date(date).toLocaleDateString('fr-FR', {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: 'numeric'
    })
    return newdate
}

const isMyPost = ()=>{
    if(post.userId === parseInt(userId)){
        setMyPost(true)
    }else{
        setMyPost(false)
    }
}

    const deletePost = () =>{
        if(window.confirm("Voulez-vous vraiment supprimer votre message?")){
            reqInstance.delete(`/posts/${id}`)
                .then(()=>getAllPosts())

        }
    }


    return (
        <div className='post' >
            <div className='post__info'>
                <p>Posté par: {post.userPseudo}</p>
                <p>Le {dateFormater(post.createdAt)}</p>
            </div>
            <div className='post__content'>
                {post.image && <img src={ image}/>}
                <p>{editContent? editContent : content}</p>
            </div>
            <div className='post__edit'>
                {myPost&&
                <Space
                direction='horizontal'
                style={{ width: '85%' }}
                >
                        <UpdatePost 
                        post={ post } 
                        editContent={editContent} 
                        setEditContent={setEditContent}
                        newImage={newImage}
                        setNewImage={setNewImage}
                        />
                        <Button type='primary' id='delete' onClick={deletePost}>Supprimer</Button>
                </Space>
               } 
                <EditLike post={ post } />
            </div> 
            {userRole === "ADMIN"
               ?<Button className='admin-btn' onClick={deletePost}>Supression ADMIN</Button>
               :""
               } 
        </div>
    )
}

export default Post;