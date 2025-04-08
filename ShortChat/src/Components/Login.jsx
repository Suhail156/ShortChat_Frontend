import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      const res = await api.post('/user/login', form);
      if (res.status === 200 && res.data?.data) {
        const { token, user } = res.data.data;
        if (!user) {
          toast.error("Login failed: user data missing");
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    >
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              value={form.emailOrPhone}
              onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Sign In
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Don’t have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-2 inline-block bg-white text-indigo-600 font-medium border border-indigo-600 px-5 py-1.5 rounded-lg hover:bg-indigo-50 transition"
          >
            Signup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
