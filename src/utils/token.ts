import dotenv from "dotenv";
import {IUser} from "../model/User";
import jwt from "jsonwebtoken"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signAccessToken = (user:IUser)=>{
    return jwt.sign(
        {
            _id:user._id,
            role:user.role,
        },
        JWT_SECRET,
        {
            expiresIn:"30m"
        })
}