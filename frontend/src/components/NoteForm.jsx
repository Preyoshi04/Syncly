import axios from "axios";
import React, { useEffect, useState } from "react";

const NoteForm = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
    setErrors("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors("No authorization token found! LOG IN");
        return;
      }
      const payload = { title, content };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config
        );
        onSave(data);
      } else {
        const { data } = await axios.post("/api/notes", payload, config);
        onSave(data.data);
      }
      setTitle("");
      setContent("");
      setErrors("");
      onClose();
    } catch (error) {
      setErrors("Failed to save notes!");
    }
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {note ? "Edit Note" : "Create a New Note"}
          </h2>

          {errors && (
            <p className="text-red-400 mb-4 text-center font-medium">
              {errors}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                value={title}
                placeholder="Title of the Note"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <textarea
                value={content}
                placeholder="Write your note content here..."
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              >
                {note ? "Update Note" : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NoteForm;
