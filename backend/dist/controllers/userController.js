"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const otpSchema_1 = __importDefault(require("../models/otpSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registration_1 = require("../helper/registration");
const galarySchema_1 = __importDefault(require("../models/galarySchema"));
const mongodb_1 = require("mongodb");
const Registeration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log('data = ', { name, email, password });
        const userData = yield userModel_1.default.findOne({ name: name, email: email });
        if (!userData) {
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            // Save user data
            const newUser = new userModel_1.default({
                name,
                email,
                password: hashPassword
            });
            yield newUser.save();
            // Generate and save OTP
            const otp = registration_1.registerHelper.generateOtp();
            console.log('otp = ', otp);
            req.session.user = email;
            const newOtp = new otpSchema_1.default({
                otp,
                name,
                email
            });
            yield newOtp.save();
            // Send OTP via helper and respond
            yield registration_1.registerHelper.sendOTP(email, otp);
            res.status(200).json({ message: 'Check your email for OTP' });
        }
        else {
            res.status(400).json({ message: 'User already exists' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, otp } = req.body;
        const otpData = yield otpSchema_1.default.findOne({ name, email });
        if (otpData) {
            if (otpData.otp === Number(otp)) {
                let updatedData = yield userModel_1.default.findOneAndUpdate({ name: name, email }, { isVerified: true });
                if (updatedData) {
                    const { accessToken, refreshToken } = registration_1.registerHelper.generateToken({ name, email });
                    res.cookie('accessToken', accessToken, { httpOnly: true });
                    res.cookie('refreshToken', refreshToken, { httpOnly: true });
                    res.status(200).json({ message: 'Otp verified successfully', id: updatedData._id });
                }
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured while updating' });
    }
});
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const data = yield userModel_1.default.findOne({ email: email });
        if (data) {
            const passwordMatch = yield bcrypt_1.default.compare(password, data === null || data === void 0 ? void 0 : data.password);
            if (passwordMatch) {
                const { accessToken, refreshToken } = registration_1.registerHelper.generateToken({ name: data === null || data === void 0 ? void 0 : data.name, email: data === null || data === void 0 ? void 0 : data.email });
                res.cookie('accessToken', accessToken, { httpOnly: true });
                res.cookie('refreshToken', refreshToken, { httpOnly: true });
                res.status(200).json({ id: data === null || data === void 0 ? void 0 : data._id, name: data === null || data === void 0 ? void 0 : data.name });
            }
            else {
                res.status(401).json({ message: 'password and userName are incorrect' });
            }
        }
        else {
            res.status(404).json({ message: 'user not found' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Successfully cleared cookie' });
    }
    catch (error) {
        res.status(500).json({ message: 'An unexpected error occured while logging out' });
    }
});
const addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { images, _id } = req.body;
        const data = yield galarySchema_1.default.findOne({ userId: new mongodb_1.ObjectId(_id) });
        let addedImages;
        if (data) {
            addedImages = yield galarySchema_1.default.findOneAndUpdate({ userId: new mongodb_1.ObjectId(_id) }, {
                $addToSet: { images: { $each: images } }
            }, { returnDocument: 'after' });
        }
        else {
            addedImages = yield new galarySchema_1.default({
                userId: _id,
                images: images
            }).save();
        }
        if (addedImages && addedImages.images) {
            res.status(200).json({ mesage: 'image successfully added', images: addedImages === null || addedImages === void 0 ? void 0 : addedImages.images });
        }
        else {
            res.status(500).json({ mesage: 'An error occured while adding images' });
        }
    }
    catch (error) {
        res.status(500).json({ mesage: 'An error occured while adding images' });
    }
});
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const images = yield galarySchema_1.default.findOne({ userId: new mongodb_1.ObjectId(id) });
        if (images) {
            res.status(200).json({ images: images.images });
        }
        else {
            res.status(200).json({ images: [] });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'An error occured while fetching data' });
    }
});
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageId, id } = req.query;
        galarySchema_1.default.updateOne({ userId: new mongodb_1.ObjectId(id) }, { $pull: {
                images: { _id: imageId }
            } }).then(() => {
            res.status(200).json({ message: 'Image successfully deleted' });
        }).catch(() => {
            res.status(500).json({ message: 'Image deletion failed' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An unexpected error occured while deleeting image' });
    }
});
const swapImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { draggedIndex, dropIndex, userId } = req.query;
        if (!draggedIndex || !dropIndex || !userId) {
            res.status(400).json({ message: 'Missing parameters' });
            return;
        }
        const idx1 = parseInt(draggedIndex, 10);
        const idx2 = parseInt(dropIndex, 10);
        if (isNaN(idx1) || isNaN(idx2)) {
            res.status(400).json({ message: 'Invalid index values' });
            return;
        }
        const gallery = yield galarySchema_1.default.findOne({ userId: new mongodb_1.ObjectId(userId) }, { images: 1, _id: 0 });
        if (!gallery || !gallery.images || gallery.images.length <= Math.max(idx1, idx2)) {
            res.status(400).json({ message: 'Invalid image indexes or no images found' });
            return;
        }
        const data = gallery.images.splice(idx1, 1);
        gallery.images.splice(idx2, 0, ...data);
        yield galarySchema_1.default.updateOne({ userId: new mongodb_1.ObjectId(userId) }, { $set: { images: gallery.images } });
        res.status(200).json({ message: 'Images swapped successfully' });
    }
    catch (error) {
        console.error('Error swapping images:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
const renameImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageId, imageName, userId } = req.body;
        const updatedData = yield galarySchema_1.default.findOneAndUpdate({
            userId: new mongodb_1.ObjectId(userId), "images._id": new mongodb_1.ObjectId(imageId)
        }, {
            $set: { "images.$.name": imageName }
        }, {
            returnDocument: 'after'
        });
        if (updatedData) {
            res.status(200).json({ images: updatedData.images });
        }
        else {
            res.status(500).json({ message: 'An error coocured while updating the image' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error coocured while updating the image' });
    }
});
exports.userController = {
    Registeration,
    verifyOtp,
    addImage,
    getImages,
    deleteImage,
    swapImages,
    renameImage,
    logOut,
    Login
};
