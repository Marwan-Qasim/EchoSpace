import express from "express";
import { signup, deleteUser, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { generateToken } from "../lib/utils.js";

const router = express.Router();

// router.use(arcjetProtection); // Apply Arcjet protection to all routes in this router

router.post("/signup", signup);
router.delete("/delete", deleteUser);
router.post("/login", login);  
router.post("/logout", logout);

router.put("/update-profile", arcjetProtection, protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => {
  // Generate fresh token for check endpoint
  const token = generateToken(req.user._id, res);
  res.status(200).json({
    ...req.user.toObject(),
    token: token,
  });
});


export default router;