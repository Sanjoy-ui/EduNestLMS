import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, UpdateProfile } from "../controllers/userController.js"

let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.post("/updateprofile",isAuth,UpdateProfile)


export default userRouter