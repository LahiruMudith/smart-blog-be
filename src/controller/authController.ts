import { Request,Response} from "express";
import {IUser, Role, Status, User} from "../model/User";
import dotenv from "dotenv"
import {signAccessToken} from "../utils/token";
import {authRequest} from "../middleware/auth";
import {signRefreshToken} from "../utils/refreshToken";
import jwt from "jsonwebtoken";

dotenv.config()

const serverPort = process.env.SERVER_PORT;
const mongoUrl = process.env.MONGO_URL;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;


export const getMyDetails = async (req:authRequest, res:Response)=>{
    const reqUser = req.user;
    if (!reqUser){
        return res.status(404).json({
            message:"User not found"
        })
    }
    const user =
        ((await User.findById(reqUser._id).select("-password")) as IUser) || null
    if (!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    res.status(200).json({
        message:"ok",
        data:{
            firstname:user.firstname,
            lastname:user.lastname,
            email:user.email,
            roles:user.role,
            approved:user.approved
        }
    })
}

export const register = async (req:Request, res:Response)=>{
    try {
        const { firstname, lastname, email, password, role} = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({
                message: "First name and last name are required"
            })
        }

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        if (!role) {
            return res.status(400).json({
                message: "Role is required"
            })
        }

        if (role != Role.USER && role != Role.AUTHOR) {
            return res.status(400).json({
                message: "Enter Valid Role"
            })
        }

        const exUser = await User.findOne({email: email})
        if (exUser) {
            return res.status(400).json({
                message: "User with this email already exists..!"
            })
        }

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: [role],
            approved: Status.PENDING
        })

        const savedUser = await newUser.save()

        res.status(201).json({
            message: "User data Saved",
            data:{
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role,
                approved: savedUser.approved
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error while creating user..!"
        })
    }
}

export const login = async (req:Request, res:Response)=>{
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email: email})
        if (!existingUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const bcrypt = require('bcrypt');
        const isPassword = await bcrypt.compare(password, existingUser.password)
        if (!isPassword) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }
        const token = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "Login Success",
            email: existingUser.email,
            role: existingUser.role,
            token,
            refreshToken
        })

    }catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error while logging in..!"
        })
    }
}

export const adminRegister = async (req:Request, res:Response)=>{
    try{
        const { firstname, lastname, email, password, role} = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({
                message: "First name and last name are required"
            })
        }

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        if (!role) {
            return res.status(400).json({
                message: "Role is required"
            })
        }

        if (role != Role.ADMIN) {
            return res.status(400).json({
                message: "Enter Valid Role"
            })
        }

        const existingUser = await User.findOne({email:email})
        if (existingUser){
            return res.status(400).json({
                message: "User with this email already exists..!"
            })
        }

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: [role],
            approved: Status.APPROVED
        })

        const saveUser = await newUser.save()

        res.status(201).json({
            message: "New Admin Registered Successfully ..!",
            id: saveUser._id,
            name: `${saveUser.firstname} ${saveUser.lastname}`,
            email: saveUser.email,
        })

    }catch (e) {
        console.error(e)
        res.status(500).json({
            message: "Internal server error while creating user..!"
        })
    }
}

export const handelRefreshToken = async (req:Request, res:Response) => {
    try {
        const { token } = req.body

        if (!token) {
            res.status(400).json({message:"Token is empty"})
        }

        const payload = jwt.verify(token, JWT_REFRESH_SECRET)
        const user = await User.findById(payload._id)
        if (!user) {
            res.status(400).json({message:"Refresh Token Invalid"})
        }
        const accessToken = await signAccessToken(user)
        res.status(200).json({accessToken})

    }catch (e) {
        console.error(e)
        res.status(500).json({message:"Invalid Refresh Token"})
    }
}