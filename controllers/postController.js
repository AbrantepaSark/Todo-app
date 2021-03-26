const Post = require('../models/Post')

// exports.viewCreateScreen = (req,res) => {
//     res.render('create-post')
// }

exports.create = function(req,res){
    let post = new Post(req.body, req.session.user._id)
    post.createItem().then(()=>{
        res.redirect('/')
    }).catch(function(errors){
        console.log(errors)
    })
} 

exports.update = function(req,res){
    let newName = new Post()
    newName.updateItem(req.body).then(()=>{
        res.redirect('/')
    }).catch((e)=>{
        console.log(e)
    }) 
}

exports.delete = function (req, res) {
  let item = new Post();
  item
    .deleteItem(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e);
    });
};

// exports.viewSingle = async function (req, res) {
//     try{ 
//         let post = await Post.findSingleById(req.params.id)
//         res.render('single-post-screen', {post: post})
//     }catch{
//         res.render('404')
//     }
// };

