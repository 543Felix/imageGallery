import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    url:{type:String,required:true},
    name:{type:String,rerquird:true}
},{timestamps:true})

const galarySchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    images:[imageSchema]
})

const imageGallary =  mongoose.model('imageGallery',galarySchema)

export default imageGallary