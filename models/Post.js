const { post } = require('../app')
 
const postsCollection = require('../db').db().collection('items')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')
const { resolve } = require('path')

let Post = function(data,userid){
    this.data = data
    this.userid = userid
    this.errors = []
}

Post.prototype.cleanUp = function(){
    if(typeof(this.data.item) != 'string'){
        this.data.item = ''
    }

    //TRIMMING DATA
    this.data = {
        item: this.data.item.trim(),
        author: ObjectID(this.userid)
    }
}

Post.prototype.validate = function () {
    if(this.data.item == ""){
        this.errors.push('You must provide a title')
    }
};

Post.prototype.createItem = function () {
    return new Promise((resolve,reject)=>{
        this.cleanUp()
        this.validate()
        if(!this.errors.length){
            //SAVE POST INTO DB
            postsCollection.insertOne(this.data).then(()=>{
                resolve()
            }).catch(()=>{
                this.errors.push('Please try again later')
                reject(this.errors)
            })
        }else {
            reject(this.errors)
        }
    })
};


Post.prototype.viewAll = function(id){
    return new Promise(async(resolve,reject)=>{
        let post = await postsCollection
          .find({ author: new ObjectID(id) })
          .toArray();
        if(post){
            resolve(post)
        }else {
            reject('Error')
        }
    })
}

Post.prototype.updateItem = function (data) {
  return new Promise(async (resolve, reject) => {
    let updatedItem = await postsCollection
      .findOneAndUpdate(
          { _id: new ObjectID(data._id) },
          {$set:{item: data.text}}
          ).then(() => {
              resolve()
          }).catch((err) => {
              reject(err)
          });
  });
};

Post.prototype.deleteItem = function (data) {
  return new Promise(async (resolve, reject) => {
    let updatedItem = await postsCollection.findOneAndDelete(
      { _id: new ObjectID(data._id) },
    ).then(() => {
        resolve()
    }).catch((err) => {
        reject(err)
    });
  });
};





// Post.findSingleById = function(id){
//     return new Promise(async function(resolve, reject){
//         if(typeof(id) != 'string' || !ObjectID.isValid(id)){
//             reject()
//             return
//         }
//         let posts = await postsCollection.aggregate([
//             {$match: {_id: new ObjectID(id)}},
//             {$lookup: {from: 'users', localField: 'author', foreignField: '_id', as: 'authorDocument'}},
//             {$project:  {
//                 title: 1,
//                 body: 1,
//                 CreatedDate: 1,
//                 author: {$arrayElemAt: ['$authorDocument', 0]}
//             }}
//         ]).toArray()
//         //CLEABN UP AUTHOR PROPERTY IN EACH POST
//         posts = posts.map(function(post) {
//             post.author = {
//                 username: post.author.username,
//                 avatar: new User(post.author, true).avatar 
//             }
//             return post
//         })

//         if(posts.length){
//             resolve(posts[0])
//         }else{
//             reject()
//         }
//     })
// }

module.exports = Post