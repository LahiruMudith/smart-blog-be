import {Router} from "express";
import {generateText} from "../controller/aiController";


const router = Router();

router.post(
    "/generate",
    generateText)
export default router;