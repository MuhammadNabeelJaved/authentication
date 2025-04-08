import express, { Router } from "express"
import { registerUser, loginUser } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)

export default router