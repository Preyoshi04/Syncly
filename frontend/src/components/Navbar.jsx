import { Notebook } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, user, navigate]);

  return (
    <>
      <nav className="bg-gray-900 p-4 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-2xl font-bold">
            <Notebook size={28} />
            SyncLy
          </div>
          {user && (
            <>
              <div>
                <input
                  type="text"
                  value={search}
                  placeholder="Search Notes"
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-gray-500 p-2 rounded-lg w-full m-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-md bg-blue-200 text-black p-2 ml-3 rounded-md font-semibold">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white p-2 text-sm rounded-3xl hover:bg-red-700 shadow-lg"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
