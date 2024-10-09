"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = (0, express_1.default)();
// Define the route correctly using the controller's method
userRouter.post('/login', userController_1.userController.Login);
userRouter.post('/register', userController_1.userController.Registeration);
userRouter.post('/verifyOtp', userController_1.userController.verifyOtp);
userRouter.post('/uploadImage', userController_1.userController.addImage);
userRouter.post('/logOut', userController_1.userController.logOut);
userRouter.get('/getImages', userController_1.userController.getImages);
userRouter.delete('/deleteImage', userController_1.userController.deleteImage);
userRouter.get('/swapImages', userController_1.userController.swapImages);
userRouter.patch('/imageRename', userController_1.userController.renameImage);
exports.default = userRouter;
