import { Request, Response } from 'express';
import User from '../models/userModel';
import Otp from '../models/otpSchema';
import bcrypt from 'bcrypt';
import { registerHelper } from '../helper/registration';
import {userSession} from '../types/session'
import imageGallary from '../models/galarySchema'
import { ObjectId } from 'mongodb';



const Registeration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log('data = ', { name, email, password });

    const userData = await User.findOne({ name: name, email: email });
    
    if (!userData) {
      const hashPassword = await bcrypt.hash(password, 10);
      
      // Save user data
      const newUser = new User({
        name,
        email,
        password: hashPassword
      });
      await newUser.save();

      // Generate and save OTP
      const otp: number = registerHelper.generateOtp();
      console.log('otp = ', otp);
      (req.session as userSession).user = email
      const newOtp = new Otp({
        otp,
        name,
        email
      });
      await newOtp.save();

      // Send OTP via helper and respond
      await registerHelper.sendOTP(email, otp);
       res.status(200).json({ message: 'Check your email for OTP' });
    } else {
       res.status(400).json({ message: 'User already exists' });
    }
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'An error occurred' });
  }
};



const verifyOtp = async (req:Request,res:Response):Promise<void>=>{
  try {
    const {name,email,otp} = req.body
    const otpData = await Otp.findOne({name,email})
    if(otpData){
         if(otpData.otp === Number(otp)){
         let  updatedData =  await  User.findOneAndUpdate({name:name,email},{isVerified:true})
         if(updatedData){
          const {accessToken,refreshToken} = registerHelper.generateToken({name,email})
          res.cookie('accessToken',accessToken,{httpOnly:true})
          res.cookie('refreshToken',refreshToken,{httpOnly:true})
          res.status(200).json({message:'Otp verified successfully',id:updatedData._id})
        }
         }
    }
  } catch (error) {
    res.status(500).json({message:'An error occured while updating'})
  }
 
   
}


const Login = async (req:Request,res:Response):Promise<void>=>{
  try {
    const {email,password} = req.body
  const data = await User.findOne({email:email})

if(data){
 const passwordMatch = await bcrypt.compare(password,data?.password)
 if(passwordMatch){
  const {accessToken,refreshToken} = registerHelper.generateToken({name:data?.name,email:data?.email})
  res.cookie('accessToken',accessToken,{httpOnly:true})
  res.cookie('refreshToken',refreshToken,{httpOnly:true})
  res.status(200).json({id:data?._id,name:data?.name})
 }else{
    res.status(401).json({message:'password and userName are incorrect'})
}
}else{
  res.status(404).json({message:'user not found'})
}
  } catch (error) {
    res.status(500).json(error)
  }
  
}
const logOut = async (req:Request,res:Response):Promise<void>=>{
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(200).json({message:'Successfully cleared cookie'})
  } catch (error) {
    res.status(500).json({message:'An unexpected error occured while logging out'})
  }
}
const addImage = async (req:Request,res:Response):Promise<void>=>{
  try {
    const {images,_id} = req.body
    const data = await imageGallary.findOne({userId: new ObjectId(_id as string) })
    let addedImages 
    if(data){
      addedImages = await imageGallary.findOneAndUpdate({userId:new ObjectId(_id as string)},{
      $addToSet:{images:{$each:images}}
    },{returnDocument:'after'})
    }else{
      addedImages = await new imageGallary({
        userId:_id,
        images:images
      }).save()
    }
    if(addedImages&&addedImages.images){
      res.status(200).json({mesage:'image successfully added',images:addedImages?.images})
    }else{
      res.status(500).json({mesage:'An error occured while adding images'})
    }

  } catch (error) {
    res.status(500).json({mesage:'An error occured while adding images'})
  }
}

const getImages = async (req:Request,res:Response):Promise<void>=>{
  try{
    const {id} = req.query
    const images = await imageGallary.findOne({userId:new ObjectId(id as string)})
    if(images){
      res.status(200).json({images:images.images})
    }else{
      res.status(200).json({images:[]})
    }
  }catch(err){
    res.status(500).json({message:'An error occured while fetching data'})
  }
 
}

const deleteImage = async (req:Request,res:Response):Promise<void>=>{
  try {
    const {imageId,id}  = req.query
imageGallary.updateOne({userId:new ObjectId(id as string)},
{$pull:{
  images:{_id:imageId}
}}).then(()=>{
  res.status(200).json({message:'Image successfully deleted'})
}).catch(()=>{
  res.status(500).json({message:'Image deletion failed'})
})
  } catch (error) {
    res.status(500).json({message:'An unexpected error occured while deleeting image'})
  }

}

const swapImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { draggedIndex, dropIndex, userId } = req.query;

    if (!draggedIndex || !dropIndex || !userId) {
      res.status(400).json({ message: 'Missing parameters' });
      return;
    }

    const idx1 = parseInt(draggedIndex as string, 10);
    const idx2 = parseInt(dropIndex as string, 10);

    if (isNaN(idx1) || isNaN(idx2)) {
      res.status(400).json({ message: 'Invalid index values' });
      return;
    }

    const gallery = await imageGallary.findOne(
      { userId: new ObjectId(userId as string) },
      { images: 1, _id: 0 }
    );

    if (!gallery || !gallery.images || gallery.images.length <= Math.max(idx1, idx2)) {
      res.status(400).json({ message: 'Invalid image indexes or no images found' });
      return;
    }

   const data =  gallery.images.splice(idx1,1)
   gallery.images.splice(idx2,0,...data)

    await imageGallary.updateOne(
      { userId: new ObjectId(userId as string) },
      { $set: { images: gallery.images } }
    );

    res.status(200).json({ message: 'Images swapped successfully' });
  } catch (error) {
    console.error('Error swapping images:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const renameImage = async (req: Request, res: Response): Promise<void> => {
  try{
    const {imageId,imageName,userId}  = req.body
    const updatedData = await imageGallary.findOneAndUpdate(
      {
      userId:new ObjectId(userId as string),"images._id":new ObjectId(imageId as string)
      },{
        $set:{"images.$.name":imageName}
      },
    {
      returnDocument:'after'
    })
     if(updatedData){
      res.status(200).json({images:updatedData.images})
     }else{
      res.status(500).json({message:'An error coocured while updating the image'})
     }
  }catch(error){
    res.status(500).json({message:'An error coocured while updating the image'})
  }
  
 

}
export const userController={
  Registeration,
  verifyOtp,
  addImage,
  getImages,
  deleteImage,
  swapImages,
  renameImage,
  logOut,
  Login
} 
