const mongodb = require('mongodb')

const connectionString = "mongodb://localhost:27017/MyToDo";

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client)=>{
    module.exports = client
    const app = require('./app')
    app.listen(3000)
})
