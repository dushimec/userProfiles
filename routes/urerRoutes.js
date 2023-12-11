const express = require('express')
const { loadRegister, insert, verifyMail, login, loginLoad, verifyLogin, homeLoad } = require('../controllers/userController')
const routes = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

routes.use(bodyParser.json())
routes.use(bodyParser.urlencoded({extended:true }))
routes.set('view engine','ejs')
routes.set('views','./views/users')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userImages'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'_'+file.originalname;
        cb(null,name)
    }
})
const upload = multer({storage:storage})

routes.get('/register', loadRegister)
routes.post('/register',upload.single('image'),insert)
routes.get('/verify',verifyMail)
routes.get('/',loginLoad)
routes.get('/login',loginLoad)
routes.post('/login',verifyLogin)
routes.get('/home',homeLoad)

module.exports = routes;