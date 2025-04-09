import express, { Router } from "express"
import { register, verifyAccount, login } from "../controllers/user.controller.js"
// import { isAuthenticated } from "../middlewares/auth.js"

const router = Router()

router.route("/signup").post(register)
router.route("/verify-account").post(verifyAccount)
router.route("/login").post(login)

export default router