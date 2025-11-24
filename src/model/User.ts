import mongoose, {Document, Schema} from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    AUTHOR = "AUTHOR",
    USER = "USER"
}

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: Role[];
    approved: Status;
}

const userSchema = new Schema<IUser>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: [String], enum:Object.values(Role), default:[Role.USER] , required: true },
    approved: { type: String, enum:Object.values(Status), default:Status.PENDING, required: true },
})

export const User = mongoose.model<IUser>("User", userSchema)
