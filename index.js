const express = require('express')
const app = express()
const DBconnecton = require("./config/db");
const routes = require('./routes/urerRoutes');
DBconnecton();
require('dotenv').config()
const port = process.env.PORT
 app.use('/',routes)

app.listen(port,()=>{
    console.log(`system is running on http://localhost:${port}`);
})



