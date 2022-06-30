import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';
import EditLike from './EditLike';
import UpdatePost from './UpdatePost';
import { Button, Space, Modal } from 'antd';

const Post = ({ post }) => {

// récupération des données du post
    const { id, content, image } = post

//récupération des données de l'utilisateur
    const { authProfil, reqInstance} = useContext(authContext)
    const userId = authProfil.id
    const userRole = authProfil.role

//récupération de la fonction qui permet d'afficher tous les posts
    const { getAllPosts } = useContext(postsContext)

//Post de l'utilisateur?
    const[myPost, setMyPost] = useState(false);

//Affichage ou non de la modal
    const [isModalVisible, setIsModalVisible] = useState(false);

const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
                .catch(()=>alert("Vous n'êtes pas authorisé à faire ça"))
        }
    }


    return (
        <div className='post' >
            <div className='post__info'>
                <p>Posté par: {post.userPseudo}</p>
                <p>Le {dateFormater(post.createdAt)}</p>
            </div>
            <div className='post__content'>
                {post.image && 
                <div className="post__content__modal">
                    <img src={ image} onClick={showModal} />
                    <Modal 
                    visible={isModalVisible} 
                    onCancel={handleCancel}
                    footer={[
                        <Button key="fermer" onClick={handleCancel}>
                        Fermer
                        </Button>
                    ]}
                    >
                    <img src={ image} style={{"width": "100%"}} />
                    </Modal>
                </div>
                }
                <p className={image?"post__content post__content--img":"post__content post__content--full"}>{content}</p>
            </div>
            <div className='post__edit'>
                {myPost && userRole === "USER"
                ?<Space
                direction='horizontal'
                style={{ width: '85%' }}
                >
                        <UpdatePost   post={ post }/> 
                        <Button type='primary' id='delete' onClick={deletePost}>Supprimer</Button>
                </Space>
                :""
                }  
                <EditLike post={ post } />
            </div> 
            {userRole === "ADMIN"
               ?<div>
                <Button className='admin-btn' onClick={deletePost}>Supression ADMIN</Button>
                <UpdatePost post={ post }/> 
               </div>
               :""
               } 
        </div>
    )
}

export default Post;