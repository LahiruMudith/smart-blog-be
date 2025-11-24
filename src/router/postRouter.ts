import {Router} from "express";
import {authenticate} from "../middleware/auth";
import {authorizeRoles} from "../middleware/authorizeRoles";
import {savePost, getAllPost, getMyPost} from "../controller/postController";
import {upload} from "../middleware/upload";
import cloudinary from "../config/cloudinary";


const router = Router();

router.get(
    "/",
    // authenticate,
    getAllPost
)
router.post(
    "/create",
    authenticate,
    authorizeRoles("ADMIN", "AUTHOR"),
    upload.single("image"),
    savePost)
router.get(
    "/me",
    authenticate,
    authorizeRoles("ADMIN", "AUTHOR"),
    getMyPost)

export default router;