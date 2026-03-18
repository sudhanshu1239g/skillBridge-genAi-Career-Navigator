const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
  username:{
    type:String,
    unique:[true,'Username already taken'],
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:[true,'Email already registered']
  },
  password:{
    type:String,
    required:true
  }
})

const User=mongoose.model('User',userSchema)

module.exports=User