import express, { Router } from "express"
import { register, verifyAccount, login, refreshAccessToken } from "../controllers/user.controller.js"
import verifyToken from "../middlewares/auth.middleware.js"
// import { isAuthenticated } from "../middlewares/auth.js"

const router = Router()

router.route("/signup").post(register)
router.route("/verify-account").post(verifyAccount)
router.route("/login").post(login)
router.route("/refresh-token").post(verifyToken, refreshAccessToken)

export default router