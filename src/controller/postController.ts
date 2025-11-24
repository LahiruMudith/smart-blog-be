import dotenv from "dotenv";
import {authRequest} from "../middleware/auth";
import {Response} from "express"
import {Post} from "../model/Post";
import cloudinary from "../config/cloudinary";
dotenv.config()

const serverPort = process.env.SERVER_PORT;
const mongoUrl = process.env.MONGO_URL;
const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

export const getAllPost = async (req:authRequest, res:Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const posts = await Post.find()
            .populate("author", "email") //get related data
            .sort({ createdAt: -1 }) //desc order
            .skip(skip) // skip data count
            .limit(limit) //need data count

        const totalDataCount = await Post.countDocuments()

        res.status(200).json({
            message:"Success",
            data:posts,
            totalDataCount,
            totalPages: Math.ceil(totalDataCount / limit),
            page
        })

    }catch (e) {
        console.log(e)
        res.status(500).json({mesage:"Fail to get all post"})
    }
}

export const getMyPost = async (req:authRequest, res:Response) => {
    try {
        if (!req.user) {
            res.status(404).json({message:"Not Found a user"})
        }
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const myAllPost = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 }) //desc order
            .skip(skip) // skip data count
            .limit(limit) //need data count

        const totalDataCount = myAllPost.length;

        if (myAllPost.length == 0){
            res.status(404).json({message:"Empty Post"})
        }

        res.status(200).json({
            message:"Success",
            data: myAllPost,
            totalDataCount,
            totalPages:Math.ceil(totalDataCount / limit),
            page
        })
    }catch (e) {
        console.log(e)
        res.status(500).json({mesage:"Fail to get post"})
    }
}

export const savePost = async (req:authRequest, res:Response) => {
    try {
        const {title, content, tags} = req.body
        if (!req.user){
            res.send(401).json({
                message: "User not found"
            })
        }

        let imageUrl = ""
        if (req.file){
            const result: any = await new Promise((resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder: "posts" } ,
                    (error, result) =>{
                        if (error){ reject(error) }
                        resolve(result)
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageUrl = result.secure_url
            const newPost = new Post({
                title,
                content,
                tags: tags.split(","), // "mobile,smartphone" --> ["mobile","smartphone"]
                imageUrl,
                author: req.user._id
            })
            await newPost.save()
            res.status(200).json({
                message: "Photo Saved to cloudinary ",
                data: newPost
            })
        }

    }catch (e) {
        console.error(e)
        res.status(500).json({
            message:"Fail to save Photo"
        })
    }

}