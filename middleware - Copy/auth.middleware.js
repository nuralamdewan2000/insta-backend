const jwt =require('jsonwebtoken');
const {BlackTokenModel} =require('../model/token.model')


const auth =async(req,res,next) =>{
    const token =req.headers.authorization?.split(' ')[1];
    const blacktoken =await BlackTokenModel.findOne(token)

    if(!blacktoken){
        const decoded =jwt.verify(token,"masai")
        if(decoded){
            console.log(decoded)
            req.body.userID = decoded.id

            next()
        }else{
            res.status(404).send({msg:'you are not authorized'})
        }
    }else{
        res.status(404).send({msg:'you are not authorized'})
    }
}



module.exports ={
    auth
}