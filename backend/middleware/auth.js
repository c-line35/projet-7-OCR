const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports=(req, res, next)=>{ 
    const { userId } = req.body
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const tokenUserId = decodedToken.id;
        const tokenUserRole = decodedToken.role
        req.auth = tokenUserId;
        req.role = tokenUserRole
        if(userId && parseInt(userId) !== tokenUserId){
            throw'userId non valable!';
            }else{
                next();
            }
        }catch(error){
            res.status(401).json({error: 'Requête non authentifiée !'});
    };
};