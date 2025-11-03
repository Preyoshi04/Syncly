import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import axios from "axios";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await axios.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false); 
      }
    };
    fetchUser();
  }, []);
  if (loading) return null;
  return (
    <>
      <div className="min-h-screen bg-gray-400">
        <Navbar user={user} setUser={setUser}/>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register setUser={setUser} />
            }
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
        <div>
          <Footer/>
        </div>
      </div>
    </>
  );
}

export default App;
