const express = require('express');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const {UserModel} =require('../model/user.model')
const {BlackTokenModel} =require('../model/token.model')


const userRouter =express.Router()

userRouter.post('/register' ,async(req,res) =>{
    const {username,email,pass,city,age,gender} =req.body;

    try{
        const exUser =await UserModel.findOne({email})
        if(exUser){
            return res.status(400).send({msg:'user is already registered,Kindly Login'})

        }

        bcrypt.hash(pass,8, async(err, data) =>{
            if(!err){
                const user =new UserModel({username,email,pass:data,city,age,gender})
                await user.save()
                res.status(200).send({msg:'user successfully registered successfully'})
            }
        })


    }catch(err){
        console.log(err)
        res.status(404).send({msg:'error in user registration',Errors:err})
    }
})


userRouter.post('/login', async(req,res) =>{
    try{
        const {email,pass} =req.body
        const user =await UserModel.findOne({email})
        if(!user){
           return res.status(400).send({msg:'user not found'})
        }

        bcrypt.compare(pass,user.pass ,async(err,hash) =>{
            if(hash){
                const token =jwt.sign({id:user._id},"masai",{expiresIn:'7d'})
                res.status(200).send({msg:'user login successfully',token})
            }
        })


    }catch(error){
        console.log(err)
        res.status(404).send({mmsg:'error in user login',Errors:error})
    }
})



userRouter.get('/logout', async(req,res) =>{
    try{

        const token =req.headers.authorization?.split(' ')[1];

        if(token){
            const blacktoken =new BlackTokenModel({blackToken:token})
            await blacktoken.save();

            res.status(200).send({msg:'user log out successfully'})
        }



    }catch(err){
        res.status(404).send({msg:'error in user logout',Errors:err})
    }
})




module.exports ={
    userRouter
}