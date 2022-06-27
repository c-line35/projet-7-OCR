import React, { useState, useContext } from 'react';
import { Button, Form, Input, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';

const contentRegexp = new RegExp(/^[a-z0-9\séèçêëàù'\-,":{}]{1,2000}$/i)

const updatePost = ({ post, editContent, setEditContent, newImage, setNewImage }) => {

    const { content, id, image } = post;

    const { authProfil, reqInstance} = useContext(authContext)
    const userId = authProfil.id

    const { getAllPosts } = useContext(postsContext)

    const [isModalVisible, setIsModalVisible] = useState(false);
    

    const headers = 'Content-Type : multipart/form-data'

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


    const normFile = (e)=>{
        setNewImage(e.file)
    }

    const updateContent = (e) =>{
        setEditContent(e.target.value)
    }

    const deleteImage = () =>{
        const data = {
            content: post.content,
            userId
        }
        const form = new FormData
        form.append('data', JSON.stringify(data))
        reqInstance.put(`/posts/image/${id}`, form, headers)
        .then(()=>{
            post.image = null
            getAllPosts()
        })
    }
    const onFinish = (e) =>{
        e.preventDefault()
            const data = {
                content: editContent? editContent: content,
                userId
            }
            const form = new FormData()
            form.append('image', newImage);
            form.append('data', JSON.stringify(data))
            reqInstance.put(`/posts/${id}`, form, headers)
        .then(()=>{
            
            getAllPosts()
            setIsModalVisible(false)
            })
        }

        const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };



    return (
<div>
        <Button onClick={showModal}> Modifier </Button>
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
                    initialValue={content}
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
                                image?
                               " Modifier l'image"
                               :"Ajouter une image"
                            }
                        </Button>
                        </Upload>
                    </Form.Item> 
                    {image && 
                    
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