const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}
// for send mail
const sendVerifyMail =async(name,email,user_id)=>{
    try {
       const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'dushimec515@gmail.com',
                pass: ''
            }
        });
        const mailOption = {
            from:'dushimec515@gmail.com',
            to:email,
            subject:'For verification mail',
            html:'<p>Hi '+name+', Please click here to <a href="http://localhost:5000/verify?id='+user_id+'">verify</a> your mail.</p>'
        }
        transporter.sendMail(mailOption,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async (req,res) =>{
    try {
        res.render('registration')
    } catch (error) {
        res.status(500).json(error)
    }
}

const insert = async(req,res) =>{
    try {
        const secpassword = await securePassword(req.body.password)
       const user = new User({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        image:req.file.filename,
        password:secpassword,
        is_admin:0
        
       })

       const userData = await user.save()
       if(userData){
        sendVerifyMail(req.body.name, req.body.mail, userData._id)
        res.render('registration',{message:"Register has been Successfully. Please verify your email"}) 
    
    }
       else{
        res.render('/registration',{message:"Failed"}) 
       }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async(req,res) =>{
    try {
      const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})

      console.log(updateInfo);
      res.render("email-verified")
    } catch (error) {
        console.log(error.message);
    }
}
// login 
const loginLoad = async(req,res) =>{
    try {
        res.render('login')
    } catch (error) {
        
    }
}

// home
const homeLoad = async(req,res) =>{
    try {
        res.render('home')
    } catch (error) {
        
    }
}

const verifyLogin = async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
       const userData = await User.findOne({email:email})

       if(userData){
        const hashPassword = await bcrypt.compare(password,userData.password)
       if (hashPassword) {
        if (userData.is_verified === 0) {
            res.render("login",{message:"Please verify your mail!"})
        } else {
            res.redirect("/home")
        }
       }
       else{
        res.render("login",{message:"password is incorrect!"})
       }
    }
       else{
        res.render("login",{message:"Email and password are incorrect!"})
       }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports ={loadRegister,insert,verifyMail,loginLoad,verifyLogin,homeLoad}