const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/user_management"
const DBconnecton = ((req,res) =>{
    mongoose.connect(url,{})
    .then(() =>{
        console.log('Database connected');
    })
    .catch((error) =>{
        console.log(error);
    })
})
module.exports = DBconnecton;