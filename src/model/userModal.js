const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const Schema = mongoose.Schema
const empSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
        validate: {
          validator: function() {
            return new Promise((res, req) =>{
              Register.findOne({email: this.email, _id: {$ne: this._id}})
                  .then(data => {
                      if(data) {
                          res(false)
                      } else {
                          res(true)
                      }
                  })
                  .catch(err => {
                      res(false)
                  })
            })
          }, message: 'Email Already Taken'
        }
      },
    

    password:{
        type:String,
        required:true,
        min:8
    
    },
    conpassword:{
        type:String,
        required:true
    },
    image: {
        type: String,
        default: 'placeholder.jpg',
      },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }]
})
//genreatte token
empSchema.methods.generateAuthToken= async function(){
    try{
        
        const tokengen= jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:tokengen})
       // console.log(tokengen);
       await this.save();
        return tokengen;
    }catch(e){
        res.send("the err part" +e);
        console.log("the err part"+e);
    }
}



//password bcrypt using hash
empSchema.pre("save",async function(next){
    if(this.isModified("password")){
    //const passwordHash =await bcrypt.hash(password,10);
    //console.log(`the current password is  ${this.password}`);
    this.password= await bcrypt.hash(this.password,10);
    //console.log(`the current password is  ${this.password}`);
    this.conpassword=await bcrypt.hash(this.password,10);

    }
    next();
})

const Register= new mongoose.model("Register",empSchema);
module.exports= Register;
