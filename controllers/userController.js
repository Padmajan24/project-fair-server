 const users = require('../models/userModel')
 const jwt = require('jsonwebtoken')

//  register logic
exports.registerController = async (req,res)=>{

    console.log("Inside register function");
    const {username,email,password} = req.body
    console.log(username,email,password);
    try{
        // email is in mongodb users
        const existingUser = await users.findOne({email})
        if(existingUser){
            // already a user
            res.status(406).json("Account already exist !! please login ...")
        }else{
            // add / register user : create object for your model 
            const newUser = new users({
                username,email,password,github:"",linkedin:"",profilePic:""
            })
            // update mongo db from model
            await newUser.save()
            res.status(200).json(newUser)
        }

    }catch(err){
        res.status(401).json(err)
    }


    //  res.status(200).json("Request received !!!")
}

// login

exports.loginController = async (req,res)=>{
    console.log("Inside Login function");
    const {email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            // token generate
            const token = jwt.sign({userId:existingUser._id},process.env.JWT_PASSWORD)
            res.status(200).json({
                user:existingUser,
                token
            })
        }else{
            res.status(404).json("Invalid email or password...")
        }

    }catch(err){
        res.status(401).json(err)
    }
}