import mongoose, {Document, Schema} from "mongoose";

export interface IPost extends Document{
    id: mongoose.Types.ObjectId
    title: string
    content:string
    tags:string[]
    imageUrl: string
    author: mongoose.Types.ObjectId
    createTime?:Date
    createDate?:Date
}

const postSchema = new Schema<IPost>({
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: {type: [String], required: true},
    imageUrl: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    },
    {
        timestamps: true,
    }
)

export const Post = mongoose.model<IPost>("Post", postSchema)