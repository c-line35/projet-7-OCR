const pkg = require ('@prisma/client')
const { PrismaClient } = pkg
const prisma = new PrismaClient()
const { User, Post, Like} = prisma;
const fs = require('fs');

const contentRegexp = new RegExp(/^[a-z0-9\\n\séèçêëàù'\-,.":{}?!;]{1,2000}$/i)

exports.createPosts = (req, res, next)=>{
   
    const valideContent = contentRegexp.test(req.body.data)
    if(!valideContent){
        return res.status(400).send({message:"Certains caractères spéciaux sont interdits dans votre message"})
    }else{
   const postObject = JSON.parse(req.body.data)
   const { userId, userPseudo, content }= postObject
   if(req.file){
    Post.create({data:
        {
           userId: parseInt(userId),
            userPseudo: userPseudo,
            content : content, 
            image :  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    })
        .then((data)=>res.status(201).send(data))     
        .catch((error) => res.status(500).send({message: error.message}))
    }else{
        Post.create({data:
            {
               userId: parseInt(userId),
                userPseudo: userPseudo,
                content : content
            }
        })
            .then((data)=>res.status(201).send(data))
            .catch((error) => res.status(500).send({message: error.message}))
        }
    }
};

exports.getAllPosts = (req, res, next)=>{
Post.findMany()
    .then((data) => {res.status(200).send(data)})
    .catch((error) => {
        res.status(500).send({
            message: error.message || 'Some error occurred while retrieving posts',
            })
        })
};

exports.getAllUserPosts = (req, res, next)=>{
    
    const { userId } = req.params;
    
    if(parseInt(userId) !== req.auth){
        res.status(401).send({message:"requête non authentifiée"})
    }else{
   
    User.findUnique({where: {id: parseInt(userId)}})
        .then(()=>{
            Post.findMany({where: {userId: parseInt(userId)}}) 
                .then((data)=>{res.status(200).send(data)})
                .catch((error)=>{res.status(500).send({message: error.message})}
                )}
        )
        .catch((error)=> res.status(500).send({message: error.message}))
    }
};

exports.updatePosts = (req, res, next)=>{
    const { id } = req.params;
    const postObject = JSON.parse(req.body.data)
    const { content } = postObject;
    if(req.file){
        Post.findUnique({where: {id: parseInt(id)}})
        .then((post)=>{
            if(post.userId === req.auth || req.role === 'ADMIN'){ 
                
                if(post.image){
                const filename = post.image.split('/images/')[1]
                fs.unlink(`images/${filename}`, ()=>{console.log('ancienne image supprimée')})}
              
                Post.update ({
                    where: {
                        id: parseInt(id),
                    },
                    data: {
                        content: content,
                        image :  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    },
                })
                    .then((data)=>res.status(200).send(data))
                    .catch((error)=>res.status(500).send({message: error.message}))
                }else{
                    return res.status(401).send({message: "Requête non authentifiée"})
                }
                })
        .catch((error)=> res.status(400).send({message: error.message}))
    }else{
        Post.update ({
            where: {
                id: parseInt(id),
            },
            data: {
                content: content
            },
        })
        .then((post)=>{
            if(post.userId === req.auth || req.role === 'ADMIN'){
            res.status(200).send(post)
        }else{
            return res.status(401).send({message: "Requête non authentifiée"})
            }
        })
        .catch((error)=>{
            res.status(500).send({message: "c'est cette erreur"})
        })
    }
}
exports.deleteImage = (req, res, next)=>{
    const { id } = req.params
    const postObject = JSON.parse(req.body.data)
    const { content } = postObject
    Post.findUnique({where: {id: parseInt(id)}})
        .then((post)=>{
            if(post.userId === req.auth || req.role === 'ADMIN'){
                if(post.image){
                    const filename = post.image.split('/images/')[1]
                    fs.unlink(`images/${filename}`, ()=>{console.log('ancienne image supprimée')})}
                    Post.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            content: content,
                            image: null
                        }
                    })
                        .then((data)=>res.status(200).send(data))
                        .catch((error)=>res.status(500).send({message: error.message}))
            }else{
                return res.status(401).send({message: "Requête non authentifiée"})
            }
        })
        .catch((error)=>res.status(400).send({message: error.message}))

}
exports.deletePosts = (req, res, net)=>{
    const { id } = req.params
    Post.findUnique({where: {id: parseInt(id)}})
    .then((post)=>{
        if(post.userId === req.auth || req.role === 'ADMIN'){
            if(post.image){
                const filename = post.image.split('/images/')[1]
                fs.unlink(`images/${filename}`, ()=>{console.log('image supprimée')})}
                Post.delete ({where:{id : parseInt(id)}})
                    .then(()=>{res.status(200).send({message: "Votre post a bien été supprimé"})})
                    .catch((error)=> res.status(400).send({message: error.message}))
             }else{
                return res.status(401).send({message: "Requête non authentifiée"})
                }  
        }) 
    .catch((error)=>res.status(400).send({message: error.message}))   
}
           
    
exports.getAllUserLike = (req, res, next)=>{
   const { id }= req.params
  
   Post.findMany({where: {Like: {some: {userId : parseInt(id)}}}})
    .then((data=>{
        if(parseInt(id !== req.auth)){
            return res.status(401).send({message: "Requête non authentifiée"})
        }else{
            res.status(200).send(data)}}))
    .catch((error)=>res.status(400).send({message: error.message}))
}



exports.likePosts = (req, res, next)=>{
  const { userId } = req.body;
  const { id } = req.params;
    Like.findMany({where: {userId: parseInt(userId)}})
    .then((data)=>{
        if(!data){
            Like.create({data: 
                {
                    userId: userId,
                    postId: parseInt(id)
                } })
                .then((data)=>res.status(201).send(data))
                .catch((error)=>res.status(400).send({message: error.message}))
        }else{
        const postLiked = data.filter(l=> l.postId === parseInt(id))
        if(!postLiked){
            return res.status(400).send({message: 'post non trouvé'})
        }else{
        if(postLiked.length === 0){
            Like.create({data: 
                {
                    userId: userId,
                    postId: parseInt(id)
                } })
                .then((data)=>res.status(201).send(data))
                .catch((error)=>res.status(400).send({message: error.message}))
                
            }else{
           for(let post of postLiked){
           const idPostLiked = post.id
           Like.delete({where:{id: parseInt(idPostLiked)}})
          .then(()=> res.status(200).send({message: "Vous n'aimez plus ce post"}))
          .catch((error)=>res.status(400).send({message: error.message}))
       }}}}
    })
    .catch((error)=> res.status(500).send({message: error.message}))
} 

exports.liked=( req, res, next)=>{
    const { id }= req.params
    const postId = req.body.postId

    Like.findMany({where: {userId: parseInt(id)}})
    .then((data)=>{
        const liked = data.filter(l=> l.postId === parseInt(postId))
        return res.status(200).send(liked)
    })
    .catch((error)=> res.status(500).send({message: error.message}))

}

