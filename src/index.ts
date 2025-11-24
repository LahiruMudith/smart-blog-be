import express from "express";
import authRouter from "./router/authRouter";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRouter from "./router/postRouter";
import aiRouter from "./router/aiRouter";
dotenv.config()

const serverPort = process.env.SERVER_PORT;
const mongoUrl:string = process.env.MONGO_URL as string;

const app = express();

//Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "https://smart-blog-web-blue.vercel.app"]
}))
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/post", postRouter)
app.use("/api/v1/ai", aiRouter)
app.get("/", (req, res) => {
    res.send("Backend is working")
})

mongoose
    .connect(mongoUrl)
    .then(()=> {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log("DB Connection Error", err)
        process.exit(1);
    })

app.listen(serverPort, () => {
    console.log("Server started on port ", serverPort);
});

