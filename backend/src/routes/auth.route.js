import express from "express";
import { signup, deleteUser, login, logout } from "../controllers/auth.controller.js";


const router = express.Router();



router.post("/signup", signup);
router.delete("/delete", deleteUser);
router.post("/login", login);  
router.post("/logout", logout);


export default router;