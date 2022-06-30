import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined} from '@ant-design/icons';
import axios from 'axios';
import { authContext } from '../context/AuthContext';

//surveillance des entrées de champs de texte
const validePassword = new RegExp (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/)

const LogForm = () => {
  
//envoi du tokken vers le context auth
  const { initToken }= useContext(authContext)

  const onFinish = (values) => {
//requête pour l'identification d'un utilisateur existant
        axios.post(
          "http://localhost:3001/api/auth/login", 
          {
            email: values.email,
            password: values.password
          })
        .then((res)=> {
          localStorage.setItem('token', res.data.token)
          initToken()
          })
          .catch((error)=>alert(error))
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
          {
            required: true,
            message: 'Please input your Email!',
          },
          {
            type: "email",
            message: "adresse email non valide"
          }
        ]}
      >
        <Input prefix={<MailOutlined  className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
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

export default LogForm;