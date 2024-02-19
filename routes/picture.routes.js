const express =require('express');
const multer =require('multer');
const {auth} =require('../middleware/auth.middleware')
const {PictureModel} =require('../model/picture.model')


const pictureRouter =express.Router();

const storage =multer.diskStorage({
    destination:function(req,file,cb ){
        cb(null,'uploads')
    },
    filename:function(req,file,cb ){
       cb(null,new Date().toDateString()+"-"+file.originalname)
    }
})


const upload =multer({storage:storage})

pictureRouter.post('/',auth,upload.single('photo'), async(req,res) =>{
    try{
        const picture =new PictureModel(req.body)
        await picture.save();
        res.status(200).send({msg:'picture saved successfully'})

    }catch(err){
        console.log(err)
        res.status(404).send({msg:'error in upload photo',error:err})
    }
})

pictureRouter.get('/',auth, async(req,res) =>{
    try{

        const {device,mincomments,maxcomments,page,limit} =req.query
        let filter ={userID:req.id};
        if(device){
            filter.device = device
        }
        if(mincomments || maxcomments){
            filter.commentsCount ={}
            if(mincomments) filter.commentsCount.$gte =mincomments
            if(maxcomments) filter.commentsCount.$lte =maxcomments
        }

        const option ={
            page:parseInt(page,10) || 1,
            limit:parseInt(limit,10) || 3
        }


        const picture =await PictureModel.paginate(filter,option)
        res.status(200).send({msg:picture})

    }catch(err){
        console.log(err)
        res.status(400).send({msg:err})
    }
})


pictureRouter.get('/:picID' ,auth ,async(req,res) =>{
    try{
        const picture =await PictureModel.findOne({
            _id:req.params.picID,
            userID:req.id
        })

        if(picture){
            res.status(200).send({msg: picture})
        }else{
            return res.status(400).send({msg:'picture not found'})
        }

    }catch(err){
        console.log(err)
        res.status(400).send({msg:err})
    }
})


pictureRouter.patch('/:picID',auth, async(req,res) =>{
    const {picID} =req.params

    try{
        const picture =await PictureModel.findOne({_id:picID})
        if(picture.userID===req.body.id){
            await PictureModel.findByIdAndUpdate({_id:picID},req.body)
            res.status(200).send({msg:`note with id ${picID} is updated`})
        }

    }catch(err){
        console.log(err)
        res.status(404).send({msg:err})
    }
})



pictureRouter.delete('/:picID',auth, async(req,res) =>{
    const {picID} =req.params

    try{
        const picture =await PictureModel.findOne({_id:picID})
        if(picture.userID===req.body.id){
            await PictureModel.findByIdAndDelete({_id:picID})
            res.status(200).send({msg:`note with id ${picID} is deleted`})
        }

    }catch(err){
        console.log(err)
        res.status(404).send({msg:err})
    }
})



module.exports ={
    pictureRouter
}