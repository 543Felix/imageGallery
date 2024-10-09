"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envVariables_1 = require("../envVariables/envVariables");
function connectDb() {
    if (envVariables_1.connectionString) {
        mongoose_1.default.connect(envVariables_1.connectionString)
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
