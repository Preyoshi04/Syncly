import express from "express";
import {
  getNotes,
  createNotes,
  updateNotes,
  deleteNotes,
  getOneNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/",protect, createNotes);
router.put("/:id",protect, updateNotes);
router.delete("/:id",protect, deleteNotes);
router.get("/:id",protect,getOneNote);

export default router;
