import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (err) {
      setErrors(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-4xl font-semibold text-center mb-5 ">Log In Page</h2>
      {errors && <p className="text-red-500 text-center">{errors}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter Your Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 px-3 py-3 border rounded-md outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-3 py-3 border rounded-md outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>
        <button className="w-full p-2 bg-blue-200 tetx-white rounded-2xl hover:bg-blue-300">
          Log In
        </button>
      </form>
      <p className="text-center mt-6">
        Don't have an account?{"  "}
        <Link className="text-blue-600 font-semibold" to="/register">
          {" "}
          Click here to Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
