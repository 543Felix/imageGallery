import express from 'express'
import dotenv from 'dotenv'
import connectDb from './mongodb/config'
import cors from 'cors'
import userRouter from './router/userRouter'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'


const app = express()

const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir);

dotenv.config()
connectDb()
app.use(session({
    secret: 'dfsd$54dwSeeers',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('your_secret_key_here'));



const corsOptions = {
    origin: [process.env.FrontEndUrl as string,'http://localhost:3001'],
    credentials: true, 
    crossOriginOpenerPolicy: 'same-origin',
};



app.use(cors(corsOptions))
app.use('/user',userRouter)

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => 
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"))
);
app.listen(process.env.PORT,()=>{ 
    console.log(`connected to http://localhost:${process.env.PORT}/`)
})