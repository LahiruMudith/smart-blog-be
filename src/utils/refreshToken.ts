import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {IUser} from "../model/User";

dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const signRefreshToken = (user:IUser)=>{
    return jwt.sign(
        {
            _id:user._id.toString(),
        },
        JWT_REFRESH_SECRET,
        {expiresIn: "7d"}
    )
}
