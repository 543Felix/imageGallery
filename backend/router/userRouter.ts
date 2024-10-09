import express from 'express';
import  {userController}  from '../controllers/userController';

const userRouter = express();

// Define the route correctly using the controller's method
userRouter.post('/login',userController.Login)
userRouter.post('/register', userController.Registeration);
userRouter.post('/verifyOtp',userController.verifyOtp)
userRouter.post('/uploadImage',userController.addImage)
userRouter.post('/logOut',userController.logOut)
userRouter.get('/getImages',userController.getImages)
userRouter.delete('/deleteImage',userController.deleteImage)
userRouter.get('/swapImages',userController.swapImages)
userRouter.patch('/imageRename',userController.renameImage)


export default userRouter;
