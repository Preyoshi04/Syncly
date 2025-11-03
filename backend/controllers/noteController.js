import mongoose from "mongoose";
import Note from "../models/noteModel.js";

// ----- GET ALL NOTES -----
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    console.error("Error in Getting Notes:", error.message);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};

// ----- CREATE A NOTE -----
export const createNotes = async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields!", success: false });
    }

    const newNote = await Note.create({
      title,
      content,
      createdBy: req.user._id,
    });
    await newNote.save();

    res.status(201).json({
      message: "Note Added Successfully!",
      success: true,
      data: newNote,
    });
  } catch (error) {
    console.error("Error in Creating Note:", error.message);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};

// ---- GETTING A PARTICULAR NOTE ----
export const getOneNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res
        .status(400)
        .json({ message: "Note not found!", success: false });
    }

    // ✅ send the found note
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    console.error("Error in getting single Note:", error.message);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};

// ----- UPDATE A NOTE -----
export const updateNotes = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note nt found" });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error("Error in Updating Note:", error.message);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};

// ----- DELETE A NOTE -----
export const deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Note not found!", success: false });
    }

    res
      .status(200)
      .json({ message: "Note Deleted Successfully!", success: true });
  } catch (error) {
    console.error("Error in Deleting Note:", error.message);
    res.status(500).json({ message: "Server Error!", success: false });
  }
};
