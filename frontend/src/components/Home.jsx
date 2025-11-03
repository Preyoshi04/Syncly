import axios from "axios";
import React, { useEffect, useState } from "react";
import { Trash2, Edit3, Plus } from "lucide-react";
import NoteForm from "./NoteForm";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [errors, setErrors] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const location = useLocation();

  //   console.log(notes);
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors("No authorization token found! LOG IN");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allNotes = data.data;
      const filteredNotes = search
        ? allNotes.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.content.toLowerCase().includes(search.toLowerCase())
          )
        : allNotes;
      setNotes(filteredNotes);

      //   console.log(data);
      //   setNotes(data.data);
    } catch (error) {
      setErrors("Failed to fetch notes!");
    }
  };
  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors("No authorization token found! LOG IN");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      setErrors("Failed to delete note!");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setFormOpen(true);
  };

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setFormOpen(false);
  };

  return (
    <>
      <div className="container mx-auto px-5 py-6">
        {errors && (
          <p className="text-red-700 mb-4 text-center font-medium">{errors}</p>
        )}
        <NoteForm
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditNote(null);
          }}
          note={editNote}
          onSave={handleSaveNote}
        />
        {/* To Add Note */}
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-15 right-6 w-14 h-14 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
        >
          <Plus size={30} />
        </button>
        <div className="text-center text-gray-900 font-bold text-3xl bg-gray-300 shadow-lg rounded-2xl py-5 w-fit mx-auto mt-6 px-8">
          From Memory → Database
        </div>

        {/* Notes Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 pb-20">
          {notes.map((note) => (
            <div
              key={note._id || note.id}
              className="bg-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 p-5 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-600">{note.content}</p>
              <p className="text-sm text-gray-400 mt-5">
                Last updated:{" "}
                <span className="italic">
                  {new Date(note.updatedAt).toLocaleString()}
                </span>
              </p>
              <div className="mt-6 flex justify-between">
                <button onClick={() => handleDelete(note._id)}>
                  <Trash2 size={28} color="red" />
                </button>
                <button onClick={() => handleEdit(note)}>
                  <Edit3 size={28} color="blue" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
