import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined   } from '@ant-design/icons';
import axios from 'axios';
import {authContext} from '../context/AuthContext'

//surveillance des entrées de champs de texte
const validePassword = new RegExp (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/)
const validePseudo = new RegExp(/^[a-z0-9\séèçêëàù'\-,']{1,15}$/i)

const SignForm = () => {

//envoi du tokken vers le context auth
  const { initToken }= useContext(authContext)

  const onFinish = (values) => {
//requête pour la création d'un nouvel utilisateur
    axios.post(
          "http://localhost:3001/api/auth/signup", 
          {
            pseudo: values.pseudo, 
            email: values.email,
            password: values.password
          })
        .then((res)=> {
          localStorage.setItem('token', res.data.token)
          initToken()
          }) 
       .catch((data)=>alert("Adresse email ou pseudo déjà utilisé"))
       
        }

 
    return (
        <div className='auth-form'>
         
    <Form
      name="normal_login"
      className="login-form"
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
       
        rules={[
           {type: "email", 
           message: 'adresse email non valide'
          
          },
          {
            required: true,
            message: 'Merci de préciser votre adresse Email!',
          },
        ]}
      >
        <Input prefix={<MailOutlined  className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item 
        name="pseudo"
        id="pseudo"
        rules={[
          {
            required: true,
            message: 'Merci de préciser votre pseudo!',
          },
          {
            pattern: validePseudo,
            message: "votre pseudo doit contenir entre 1 et 15 caractères, certains caractères spéciaux sont interdits"
          }
        ]}
      >
        <Input prefix={<UserOutlined  className="site-form-item-icon" />} placeholder="Pseudo" />
      </Form.Item>
    

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Veuillez rentrer votre mot de passe',
          },
          {
            pattern: validePassword,
            message:`Votre mot de passe doit avoir: - de 8 à 15 caractères
            - au moins une lettre minuscule
            - au moins une lettre majuscule
            - au moins un chiffre
            - au moins un de ces caractères spéciaux: $ @ % * + - _ !`
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
  
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Envoyer
        </Button>
      </Form.Item>
    </Form>

    </div>
    );
};

export default SignForm;