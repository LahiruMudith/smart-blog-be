import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface authRequest extends Request {
    user?:any
}

export const authenticate = (req:authRequest, res:Response, next:NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provide"
        })
    }
    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload
        next()
    }catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}