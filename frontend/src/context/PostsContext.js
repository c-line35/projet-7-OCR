import React, { useState, useContext, useEffect } from "react";
import { authContext } from "./AuthContext";

//création d'un contexte pour récupérer les données des postes
export const postsContext = React.createContext({
   posts: [],
   getAllPosts: ()=>{},
   getUserPosts:()=>{},
   getUserLikePosts:()=>{},
   content: "",
   setContent :()=>{},
   file: "",
   setFile:()=>{}

});

const PostsContextProvider=({ children })=>{

  
    useEffect(()=>{
      getProfil()
    },[])

    //récupération des données de l'utilisateur grace au contxte utilisateur
    const { authProfil, reqInstance, getProfil} = useContext(authContext)
    const { id } = authProfil
      
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState({});
    const [file, setFile] = useState("");

//requête pour récupérer tous les posts
    const getAllPosts = ()=>{
        reqInstance.get(
          "/posts",
          {userId: parseInt(id)}
        )
          .then((res)=>{
            setPosts(res.data)})
      }

      //requête pour récupérer tous les posts de l'utilisateur connecté
      const getUserPosts = ()=>{
        reqInstance.get(
          `/posts/user/${id}`,
          {userId: parseInt(id)}
      
        )
          .then((res)=>{
            {res.data.length === 0?
            alert("Vous n'avez pas encore de post")
            :setPosts(res.data)}
          })
      }

// requête pour récupérer les posts likés de l'utilisateur connéecté
      const getUserLikePosts = ()=>{
           reqInstance.get(
          `/posts/likes/${id}`,
          {userId: parseInt(id)}
        
          )
          .then((res)=>{
            {res.data.length === 0?
              alert("Vous n'avez pas encore de posts favoris")
              :setPosts(res.data)}
          })
        }

        return(
    <postsContext.Provider value = { {posts, getAllPosts, getUserPosts, getUserLikePosts, content, setContent, file, setFile }  } >
        { children }
    </postsContext.Provider>)

}
export default PostsContextProvider