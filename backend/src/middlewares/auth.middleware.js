const jwt=require('jsonwebtoken')
const tokenBlacklistModel=require('../models/blacklist.model')

async function authUser(req,res,next){
    
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    const istokenBlacklisted=await tokenBlacklistModel.findOne({token})
    if(istokenBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    } catch (error) {
        console.error('Error in auth middleware:',error)
        res.status(401).json({message:'Unauthorized'})
    }
}

module.exports={authUser}