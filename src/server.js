const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

// POST /posts
server.post('/posts',(req, res)=>{
  const {author, title, contents} =req.body;
  if ( author && title && contents){
    const newPost={
      id: newId(),
      author,      
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else {
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post'});
  }
  
  
});
//POST /posts/author/:author falta en informa el parametro title
server.post('/posts/author/:author', (req, res)=>{
  const{title, contents}=req.body;
  const{author}=req.params.author;

  if ( title && contents && author){
    const newPost={
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);

  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post'});
  }
  
});
//GET /posts
server.get('/posts', (req, res)=>{
  const term =req.query.term;

  if ( term ){
    const postsEnc =  posts.filter(function(post){
      return ( post.title.includes(term) || post.contents.includes(term))
        
    });

    return res.json(postsEnc);
  }else{
    
    return res.json(posts);
  }
});


//`GET` en la ruta `posts/:author`:
server.get('/posts/:author', (req, res)=>{
  const author = req.params.author;
  const existe = posts.filter(function(post){
    return post.author===author});

  if (existe.length !== 0){
    return res.json(existe);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No existe ningun post del autor indicado'});
  }

});
//`GET` en la ruta `posts/:author`:
server.get('/posts/:author/:title', (req, res)=>{
  const author = req.params.author;
  const title= req.params.title;
  const existe = posts.filter(function(post){
    return (post.author===author && post.title===title)
  });
  if (existe.length!==0){
    return res.json(existe);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No existe ningun post con dicho titulo y autor indicado'});
  }

});
//PUT /posts
server.put('/posts', (req, res)=>{
  const{id, title, contents}=req.body;

  if (id && title && contents){
    const existId = posts.find(post=>post.id===id);
    
    if(existId){

      existId.title=title;
      existId.contents=contents;

      return res.json(existId);
    }else{
      return res.status(STATUS_USER_ERROR).json({
        error:'No se recibieron los parámetros necesarios para modificar el Post'});
    }

  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para modificar el Post'});
  }
});
// `DELETE /posts
server.delete('/posts', (req, res)=>{
  const id=req.body.id;
  if (id){
    const existId = posts.find(post=>post.id===id);
    if (existId){
      posts = posts.filter(post=> post.id!==existId.id);
       res.json({ success: true });
    }
    else{
       res.status(STATUS_USER_ERROR).json({
        error:'Mensaje de error'});
    }
   
  }else{
     res.status(STATUS_USER_ERROR).json({
      error:'Mensaje de error'});
  }

});
// `DELETE /posts
server.delete('/author', (req, res) => {
  if (req.body.author) {
      const post = posts.find(post => post.author === req.body.author);
      if (post) {
          posts = posts.filter(post => post.author === req.body.author);
          res.json(posts);
      } else {
          return res.status(STATUS_USER_ERROR).json({
              error: "No existe el autor indicado"
          });
      }
  } else {
      return res.status(STATUS_USER_ERROR).json({
          error: "Mensaje de error"
      });
  }

})
module.exports = { posts, server };
