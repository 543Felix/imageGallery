import {Session} from "express-session";

export interface userSession extends Session{
    user :string
}