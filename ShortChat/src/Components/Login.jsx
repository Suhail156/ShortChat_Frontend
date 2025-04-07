import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api'; // your Axios setup

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
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        toast.success('Login successful');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Login
          </button>
        </form>
        <div className="flex justify-center mt-6">
          <button onClick={() => navigate('/signup')} className="bg-gray-500 text-white py-2 px-6 rounded">
            Signup?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
