const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/employee",{
//useCreatIndex:true,
useNewUrlParser:true,
useUnifiedTopology:true,

}).then(()=>{
    console.log("connection is sucessful");
}).catch((e)=>{
     console.log(" no connection");
})