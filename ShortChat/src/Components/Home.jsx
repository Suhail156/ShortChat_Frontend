import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import api from "../api";

let socket;

const Home = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);
  const userId = user?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Initialize socket only once
    socket = io("https://shortchat-backend.onrender.com", {
      auth: {
        token,
      },
    });

    socket.on("receive_message", (data) => {
      if (
        (data.sender === selectedUser?._id && data.receiver === userId) ||
        (data.sender === userId && data.receiver === selectedUser?._id)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });

    fetchUsers();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all");
      setUsers(res.data.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${userId}/${selectedUser._id}`);
      setChat(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msg = {
      sender: userId,
      receiver: selectedUser._id,
      content: message,
    };

    socket.emit("send_message", msg);
    await api.post("/messages", msg);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u._id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedUser?._id === u._id ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => setSelectedUser(u)}
            >
              {u.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-2/3 bg-white p-4 shadow rounded flex flex-col">
        <h2 className="text-xl font-semibold mb-3">
          Chat with: {selectedUser?.name || "Select a user"}
        </h2>

        <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50 space-y-2">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] px-4 py-2 rounded text-sm ${
                msg.sender === userId
                  ? "ml-auto bg-blue-200 text-right"
                  : "mr-auto bg-green-200 text-left"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
