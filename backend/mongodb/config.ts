import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

function connectDb(){
    const connectionString = process.env.Mongoosse_Conection_String as string
    console.log('connectionString = ',connectionString)
    if(connectionString){
        mongoose.connect(connectionString)
        .then(()=>{
           console.log('successfully connected to mongodb')
        }).catch(()=>{
            console.log('An error occured while connecting with mongodb')
        })
    }else{
        console.log('mongoose connection string is empty')
    }
    
}

export default connectDb