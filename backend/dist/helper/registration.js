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
exports.registerHelper = void 0;
const otplib_1 = require("otplib");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const envVariables_1 = require("../envVariables/envVariables");
function generateOtp() {
    let otp = otplib_1.authenticator.generateSecret();
    const token = otplib_1.authenticator.generate(otp);
    return Number(token);
}
function generateToken(data) {
    const payload = {
        data
    };
    let accessToken = jsonwebtoken_1.default.sign(payload, envVariables_1.accessTokenSecretKey, { expiresIn: '15s' });
    let refreshToken = jsonwebtoken_1.default.sign(payload, envVariables_1.refreshTokenSecretKey, { expiresIn: '7d' });
    return {
        accessToken,
        refreshToken
    };
}
const sendOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: envVariables_1.senderMail,
            pass: envVariables_1.senderMailPassword,
        },
    });
    const mailOptions = {
        from: envVariables_1.senderMail,
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${otp}`,
    };
    yield transporter.sendMail(mailOptions);
});
exports.registerHelper = {
    generateOtp,
    generateToken,
    sendOTP,
};
