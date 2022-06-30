import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Input, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { authContext } from '../context/AuthContext';
import { postsContext } from '../context/PostsContext';

//Surveillance des entrées dans le champ du contenu du post
const contentRegexp = new RegExp(/^[a-z0-9\séèçêëàù'\-,.":{}!?;]{1,2000}$/i)

const NewPost = () => {

//récupération des données de l'utilisateur connecté
    const { authProfil, reqInstance} = useContext(authContext)
    const { id, pseudo }= authProfil

//récupération des données des postes
    const { getAllPosts, content, setContent, file, setFile} = useContext(postsContext)

// affichage ou non de la modal   
    const [isModalVisible, setIsModalVisible] = useState(false);

//configuration du header de la requête pour envoyer des données de types différents
const headers = 'Content-Type : multipart/form-data';
const handleCancel = () => {
    setIsModalVisible(false);
};

const showModal = (e) => {
    setIsModalVisible(true);
};

//mise à jour de l'image
    const normFile = (e) => {
        setFile(e.file)
    };

// mise à jour du contenu     
    const getContent = (e)=>{
        setContent(e.target.value)
    }

    const onFinish = () => {
        const valideContent = contentRegexp.test(content)
       
            if(!valideContent){
                alert("Ce message n'est pas valide")
            }else{
       const data = {
            userId: id,
            userPseudo: pseudo,
            content: content
        }
        const form = new FormData()
        form.append('image', file);
        form.append('data', JSON.stringify(data))

        reqInstance.post(
            `/posts`, 
            form,
            headers
        )
        .then(()=>{
            setContent("")
            setFile("")
            getAllPosts()
            setIsModalVisible(false)
        }) }
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='newPost'>
           <Button type="primary" onClick={showModal}>Nouveau message </Button>
            <Modal 
            title="Nouveau message" 
            visible={isModalVisible} 
            destroyOnClose={true}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={onFinish}>
                Publier
                </Button>,
            ]}
            >
                <Form
                 onFinish={onFinish}
                 onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="content"
                        onChange ={getContent}
                        rules={[
                        {
                            required: true,
                            message: "Oups, vous avez oublié d'écrire un message!",
                        },
                        {
                            pattern: contentRegexp,
                            message:"Certains caractères spéciaux sont interdits dans votre message"
                        }
                        ]}
                    >
                        <Input.TextArea rows={4}/>
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
                        <Button icon={<UploadOutlined />}>Choisir une image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal> 
        </div> 
    );
};

export default NewPost;