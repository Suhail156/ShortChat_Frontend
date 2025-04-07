import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import md5 from 'md5';

const Login = () => {
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }

      const res = await api.post("/user/login", {
        ...form,
        password: md5(form.password),
      });

      if (res.status === 200 && res.data?.data) {
        // Save the full user object for future use (e.g., chat)
        localStorage.setItem("user", JSON.stringify(res.data.data));
        alert("Login successful");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="flex justify-center mt-6">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            onClick={() => navigate('/signup')}
          >
            Signup?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
