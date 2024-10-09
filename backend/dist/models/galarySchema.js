"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true },
    name: { type: String, rerquird: true }
}, { timestamps: true });
const galarySchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    images: [imageSchema]
});
const imageGallary = mongoose_1.default.model('imageGallery', galarySchema);
exports.default = imageGallary;
