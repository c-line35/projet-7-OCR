import React, { useState, useContext } from 'react';
import { Button, Form, Input, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';

//Surveillance des entrées dans le champ du contenu du post
const contentRegexp = new RegExp(/^[a-z0-9\séèçêëàù'\-,.":?!;{}]{1,2000}$/i)


const updatePost = ({ post }) => {
    const postContent = post.content;
    const postImage = post.image;
    const postId = post.id;
  
//récupération des données de l'utilisateur connecté
    const { authProfil, reqInstance} = useContext(authContext)
    const userRole = authProfil.role;

//récupération des données des postes
    const { getAllPosts, content, setContent, file, setFile } = useContext(postsContext)

// affichage ou non de la modal
    const [isModalVisible, setIsModalVisible] = useState(false);

//configuration du header de la requête pour envoyer des données de types différents
    const headers = 'Content-Type : multipart/form-data';

   
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

//mise à jour de l'image
    const normFile = (e)=>{
        setFile(e.file)
    }

// mise à jour du contenu 
    const updateContent = (e) =>{
        setContent(e.target.value)
    }

//suppression uniquement de l'image
    const deleteImage = () =>{
        if(window.confirm("Voulez-vous vraiment supprimer l'image?")){
        const data = {
            content: postContent,
        }
        const form = new FormData
        form.append('data', JSON.stringify(data))
        reqInstance.put(`/posts/image/${postId}`, form, headers)
        .then(()=>{
            getAllPosts()
            setIsModalVisible(false)
            })
            .catch(()=>alert("Vous n'êtes pas autorisé à faire ça!"))
        }
    }

//validation du formulaire
    const onFinish = (e) =>{
        e.preventDefault()
        const contentLength = Object.keys(content).length
        const data = {
            content: contentLength === 0 ? postContent :content
        }
        const form = new FormData()
        form.append('image', file);
        form.append('data', JSON.stringify(data))
        reqInstance.put(`/posts/${postId}`, form, headers)
            .then(()=>{
                console.log("post modifié")
                getAllPosts()
                setIsModalVisible(false)
        })
        .catch(()=>alert("Vous n'êtes pas autorisé à faire ça!"))
    }

        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };


    return (
<div>
        <Button 
        onClick={showModal}
        className = {userRole === "ADMIN" ? "admin-btn":"ant-btn ant-btn-default"}
        > {userRole === "ADMIN"? "Modification ADMIN" :"Modifier"} </Button>
            <Modal 
                title="Modification de votre message" 
                visible={isModalVisible} 
                destroyOnClose={true}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                         Annuler
                    </Button>,
                    <Button key="submit" type="primary" onClick={onFinish} >
                        Enregistrer
                    </Button>
                ]}          
            >
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                   <Form.Item
                    initialValue={postContent}
                        name="content"                         
                        onChange ={updateContent}
                    rules={[
                        {
                        required: true,
                        message: "Oups, vous avez oublié d'écrire un message!",
                        },
                        {
                        pattern: contentRegexp,
                            message: "Certains caractères spéciaux sont interdits dans votre message"
                        }
                        ]}
                    >
                        <Input.TextArea rows={5} />
                    </Form.Item>
                    <Form.Item
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload 
                        name="image" 
                        listType="picture"  
                        maxCount = {1}
                        beforeUpload="false"
                    >
                        <Button icon={<UploadOutlined />}>
                            {
                                postImage?
                               " Modifier l'image"
                               :"Ajouter une image"
                            }
                        </Button>
                        </Upload>
                    </Form.Item> 
                    {postImage && 
                    <Button key="cancelImage" onClick={deleteImage}>
                        Supprimer l'image
                    </Button>
                    }
                </Form>  
                </Modal>
            </div>
    );
};

export default updatePost;