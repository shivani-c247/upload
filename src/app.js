require('dotenv').config()
const express = require("express");
const path =require("path");
const app = express();
const hbs =require("hbs");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser'); 
const auth= require("./middleware/auth");
require("./db/conn");
const cookieParser = require("cookie-parser");
const Register = require("./model/userModal");
const {json }= require("express");
const { cookie } = require('express/lib/response');
const multer = require("multer");
const port= process.env.PORT || 3003;


//using in index1 file in public folder
const static_path= path.join(__dirname,"../public/css");// 2 times __   // use for public folder
const template_path= path.join(__dirname,"../viewsTemp/views");
const partials_path= path.join(__dirname,"../viewsTemp/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");


app.set("views",template_path);
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY);


app.get("/",(req,res)=>{
    res.render("index1");
});

app.get("/index1",(req,res)=>{
    res.render("index1");
});

app.get("/secret",auth ,(req,res)=>{
    res.render("secret");
});


/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 * @apiDescription Creates a new user
 * @apiParam {Number} id Users unique ID.
 *
 * @apiBody {string} firstName first name of user
 *  @apiBody {string} lastname last name of user

 * @apiBody {string} email email of user
 * @apiBody {string} password selected password
 * @apiBody {string} confirmpassword selected password
 * @apiBody {string} image selected image/file
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  message: "Data saved successfully.",
 *   data:
 *      [{
 *       "firstname": "John",
 *       "lastname": "Doe",
 *         "email":john@example.com,
 *          "password":example123,
 *             "cpassword":example123
 *              "image":name
 *     }],
 *
 *  @apiSuccess {String} access_code JWT
 * @apiSuccessExample Success Response
 * 
 * HTTP/1.1 200 OK
 * {
 * "access_token": "your access token"
 * }
 * 
 * * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   
 *   "error": actual error stack
 * }
 */

  app.get("/ragister",(req,res)=>{
    res.render("ragister");
});
 

app.post("/ragister", async(req,res)=>{
    
   try{
    
       const password=req.body.password;
       const cpassword=req.body.conpassword;
       if(password === cpassword){

           const emp= new Register({
               firstname:req.body.firstname,
               lastname:req.body.lastname,
               email:req.body.email,
               password:password,
               conpassword:cpassword,
               image:req.body.filename,
           })

//generate Token with these 3 lines
           console.log("the success part "+ emp);
            const token = await emp.generateAuthToken();
            console.log("the token part "+ token);


            //res.cookie(name , value ,[ options])//jwt cookiee name
            res.cookie("jwt", token, {
                expires:new Date(Date.now() + 30000),
                httpOnly:true
            });
            console.log(cookie);
           const  regi = await emp.save();
           res.status(201).render("success");
       }
       else{
           res.send(" password not matched");
       }
//console.log(req.body.firstname);

   }catch(e){
    res.status(400).send(e);
    //console.log("error part")
   }

});



/**
 * @api {get} /user/:id login information
 * @apiName Authentication
 * @apiGroup Login
 * @apiParam {String} email email of the user
 * @apiParam {String} password Password of the user
 * 
 * @apiSuccess {String} access_code JWT
 * @apiSuccessExample Success Response
 * 
 * HTTP/1.1 200 OK
 * {
 * "access_token": "your access token"
 * }
 * 
 * @apiErrorExample Invalid Credentials
 * {
 * "description": "Invalid credentials",
 * "error": "Bad Request",
 * "status_code": 401
 * }
 * 
 */
 


app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{

    try{
        const email=req.body.email;
        const password=req.body.password;
      //  console.log(`${email} and pass is ${password}`)
       const useremail= await Register.findOne({email:email});
       const isMatch = await bcrypt.compare(password , useremail.password);
       const token = await useremail.generateAuthToken();
       console.log("the token part "+ token);

       res.cookie("jwt", token, {
        expires:new Date(Date.now() + 2000000),
        httpOnly:true
    });
    console.log(`this is the cookie ${req.cookies.jwt}`);
       
        //res.send(useremail);
        //console.log(useremail)
        if(isMatch){
            res.status(201).render("secret");
        }else{
            res.send("invalid password");
        }

    }catch(e){
        res.status(400).send("invalid login details")
    }
    
    //res.render("login");
});

/**
 * 
 * @api {get} /user/:id logout information
 * @apiName Authentication
 * @apiGroup Logout
 * 
 * @apiSuccess {String}  delete access_code JWT

 * 
 *
 * @apiErrorExample JsonWebTokenError
 * {
 * "description": "login first then log out",
 * "error": "jwt must be provided",
 * "status_code": 500
 * }
 * 
 */


app.get("/logout",auth,async(req,res)=>{
    try{
           // console.log(req.user);
           req.user.tokens=req.user.tokens.filter((currentElement)=>{
               return currentElement.token !== req.token;
           })
        res.clearCookie("jwt");
        console.log("successfully");
        await req.user.save();
        res.render("login");
    }
    catch(e){
        res.status(500).send(e);
    }
});
//immage upload


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

var uploadMultiple = upload.fields([{ name: 'file1', maxCount: 10 }])


app.get("/", (req, res) => {
  res.render("secret");
});

app.post('/index1', uploadMultiple, function (req, res, next) {

    if(req.files){
        console.log(req.files)

        console.log("files uploaded")
    }
    
})



app.listen(port,()=>{
    console.log('server is running at port ',port);
})