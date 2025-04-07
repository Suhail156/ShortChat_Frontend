import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../api";

const socket = io("http://localhost:3521");

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")); // Must include _id
  const userId = user?._id;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (
        (data.sender === selectedUser?._id && data.receiver === userId) ||
        (data.sender === userId && data.receiver === selectedUser?._id)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser]);

  const fetchUsers = async () => {
    const res = await api.get("/user/all");
    setUsers(res.data.filter((u) => u._id !== userId));
  };

  const fetchMessages = async () => {
    const res = await api.get(`/messages/${userId}/${selectedUser._id}`);
    setChat(res.data);
  };

  const sendMessage = async () => {
    if (message.trim() === "" || !selectedUser) return;

    const newMessage = {
      sender: userId,
      receiver: selectedUser._id,
      content: message,
    };

    try {
      socket.emit("send_message", newMessage);
      await api.post("/messages", newMessage);
      setMessage("");
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-6">
      {/* User List */}
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

      {/* Chat Box */}
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
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
