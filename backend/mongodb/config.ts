import mongoose from 'mongoose'
import {connectionString} from '../envVariables/envVariables'

function connectDb(){
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