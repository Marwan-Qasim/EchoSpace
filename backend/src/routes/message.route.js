import express from 'express';
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
  deleteConversation,
} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chat-partners", getChatPartners);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);
router.delete("/conversation/:id", deleteConversation);

export default router;
