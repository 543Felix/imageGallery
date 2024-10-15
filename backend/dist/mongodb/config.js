"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import {connectionString} from '../envVariables/envVariables'
function connectDb() {
    const connectionString = process.env.Mongoosse_Conection_String;
    console.log('connectionString = ', connectionString);
    if (connectionString) {
        mongoose_1.default.connect(connectionString)
            .then(() => {
            console.log('successfully connected to mongodb');
        }).catch(() => {
            console.log('An error occured while connecting with mongodb');
        });
    }
    else {
        console.log('mongoose connection string is empty');
    }
}
exports.default = connectDb;
