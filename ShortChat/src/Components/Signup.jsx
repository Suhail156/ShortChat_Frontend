import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      const res = await api.post("/user/signup", form);
      if (res.status === 201) {
        toast.success("Welcome to ShortChat 🎉");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200 relative overflow-hidden px-4">
      <Toaster position="top-right" />
      <div className="absolute w-72 h-72 bg-white/20 rounded-full top-20 left-10 blur-3xl animate-ping" />
      <div className="absolute w-96 h-96 bg-white/30 rounded-full bottom-24 right-0 blur-2xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="z-10 backdrop-blur-xl bg-white/70 border border-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 border-4 border-dashed border-indigo-400/10 rounded-3xl pointer-events-none animate-pulse" />
        <h1 className="text-center text-5xl font-black text-indigo-700 tracking-tight mb-1">ShortChat</h1>
        <p className="text-center text-sm text-gray-600 mb-6 italic">Where connections start ✨</p>

        <form onSubmit={handleSubmit} className="space-y-5 z-10 relative">
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2.5 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition duration-300"
          >
            Register
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-700">Already on ShortChat?</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 inline-block bg-white text-indigo-600 font-semibold border border-indigo-600 px-5 py-1.5 rounded-xl hover:bg-indigo-50 transition"
          >
            Login
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">© 2025 ShortChat. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
