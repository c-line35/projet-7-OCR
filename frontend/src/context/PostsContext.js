import React, { useState, useContext, useEffect } from "react";
import { authContext } from "./AuthContext";


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

    
    const { authProfil, reqInstance, getProfil} = useContext(authContext)
    const { id } = authProfil
      
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState({});
    const [file, setFile] = useState("");


    const getAllPosts = ()=>{
        reqInstance.get(
          "/posts",
          {userId: parseInt(id)}
        )
          .then((res)=>{
            setPosts(res.data)})
      }

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