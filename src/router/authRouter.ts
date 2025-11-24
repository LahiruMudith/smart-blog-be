import {Router} from "express";
import {getMyDetails, register, login, adminRegister, handelRefreshToken} from "../controller/authController";
import {authorizeRoles} from "../middleware/authorizeRoles";
import {authenticate} from "../middleware/auth";

const router = Router();

router.post("/refresh", handelRefreshToken)

// (protected)
router.get("/me", authenticate, getMyDetails)

router.post("/register", register)
router.post("/login", login)
router.post("/admin/register", authenticate, authorizeRoles("ADMIN"), adminRegister)

export default router;