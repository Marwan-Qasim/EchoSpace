import express from "express";
import { signup, deleteUser} from "../controllers/auth.controller.js";


const router = express.Router();



router.post("/signup", signup);
router.delete("/delete", deleteUser);




export default router;