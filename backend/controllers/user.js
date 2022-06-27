const pkg = require ('@prisma/client')
const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { User } = prisma

const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
require('dotenv').config;

const regexpPseudo = new RegExp(/^[a-z0-9\séèçêëàù'\-,']{1,15}$/i)

exports.signup = (req, res, next)=>{
    const validePseudo = regexpPseudo.test(req.body.pseudo)
    if(!validePseudo){
        return res.status(400).send({message: 'votre pseudo doit contenir entre 1 et 15 caractères, certains caractères spéciaux sont interdits'})
    }else{
    bcrypt.hash(req.body.password, 10)
    .then (hash=>{
        const password = hash 
        const { pseudo } = req.body;
        const { email } = req.body;
    
        User.create({data:
            {
            pseudo: pseudo,
            email: email,
            password : password
            }
        })
        .then((data) => {
            res.status(201).send( {  
                pseudo: data.pseudo,
                email: data.email,
                id: data.id,
                password : password,
                token: jwt.sign(
                    {id: data.id, role: data.role},
                    process.env.TOKEN_KEY,
                    {expiresIn: '24h'}
                )
            })})
        .catch((err) => {res.status(400).send({message: err.message})
        });
   })
   .catch ((err)=> {res.status(400).send({message: err.message})
    })}
};

exports.login = (req, res, next)=>{
    const { email } = req.body;
    const { password } = req.body;
    
    User.findUnique({where: {email: email }})
    .then((data)=> {
        if (!data){
        res.status(404).send({message: ('utilisateur non trouvé')})
        }else{
        bcrypt.compare(password, data.password)
        .then(valid=>{
            if(!valid){
                res.status(401).send({message: 'mot de passe incorrect'})
            }else{
            res.status(200).send(
                {  
                pseudo: data.pseudo,
                email: data.email,
                id: data.id,
                token: jwt.sign(
                    {id: data.id, role: data.role},
                    process.env.TOKEN_KEY,
                    {expiresIn: '24h'}
                    )})
                }
            })
        }
    })
    .catch((error)=> res.status(500).send({message: error.message}))
}

exports.getDataUser = (req, res, next)=>{

    const token= req.params.token;
    
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const  id  = decodedToken.id;

    User.findUnique({where: {id: parseInt(id)}})
    .then((data)=>{
        if(!data){
            res.status(404).send({message: 'Utilisateur non trouvé'})
        }else{
       
        res.status(200).send(data)
        }
    })
}
