import session from 'express-session'
 
interface User{
    name:string,
    email:string
}

declare module 'express-session' {
    interface SessionData {
        user?: string
    }
}