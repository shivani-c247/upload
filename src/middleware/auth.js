const jwt= require("jsonwebtoken");
const Register = require("../model/userModal");

/**
 * 
 * @api {get} /user/:id Authentication
 * @apiName Authentication
 * @apiGroup Auth
 * 
 *
 * @apiErrorExample JsonWebTokenError
 * {
 * "description": "login first then after acccess privatte page",
 * "error": "jwt must be provided",
 * "status_code": 500
 * }
 * 
 */

const auth = async( req,res,next)=>{
 try{
const  token=req.cookies.jwt;
const verifyUdser= jwt.verify(token, process.env.SECRET_KEY);
console.log(verifyUdser);

const user =await Register.findOne({_id:verifyUdser._id});
console.log(user);
req.token=token;//for logout
req.user=user;
next();
 }
 catch(e){
res.status(401).send(e);
 }
}





module.exports=auth;