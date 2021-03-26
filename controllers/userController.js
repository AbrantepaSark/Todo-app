const User = require('../models/User')
const Post = require('../models/Post')


// exports.mustBeLoggedIn = function(req,res,next){
//     if(req.session.user){
//         next()
//     }else {
//         req.flash('errors', 'You must be logged in')
//         req.session.save(function(){
//             res.redirect('/')
//         })
//     }
// }




exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      req.session.user = {
        username: user.data.username,
        _id: user.data._id,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((e) => {
        req.flash('errors', e)
        req.session.save(()=>{
            res.redirect('/sign_in')
        })
    });
};



exports.logout = function(req,res) {
    req.session.destroy(()=>{
        res.redirect('/')
    })
};

exports.cancel = function(req,res){
  res.redirect('/')
}



exports.register = function(req,res) {
    let user = new User(req.body)
    user.register().then(()=>{
        req.session.user ={username: user.data.username, _id: user.data._id}
        req.session.save(function () {
          res.redirect("/");
        });
    }).catch((regErrors)=>{
          regErrors.forEach(function (error) {
            req.flash("regErrors", error);
          });
        req.session.save(function () {
          res.redirect("/");
        });
    })
    
};



exports.home = function (req,res) {
    if(req.session.user){
      let post = new Post()
      post.viewAll(req.session.user._id).then(result => {
        res.render("index",{result: result});
      })
        
    }else{
      res.render('reg', {regErrors: req.flash('regErrors')})
    }
};

exports.reg = function (req, res) {
    res.render('log_in', {errors: req.flash('errors')})
  }


// exports.ifUserExists = function(req,res, next){
//   User.findByUsername(req.params.username).then(function(userDocument){
//     req.profileUser = userDocument 
//     next()
//   }).catch(function(){
//     res.render('404')
//   })
// }

// exports.profilePostsScreen = function(req,res){
//   res.render('profile',{
//     profileUsername: req.profileUser.username,
//     profileAvatar: req.profileUser.avatar
//   })
// }

