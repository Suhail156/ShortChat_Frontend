import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser || storedUser === "undefined") {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const normalizedUser = {
        ...parsedUser,
        _id: parsedUser._id || parsedUser.id,
      };
      setUser(normalizedUser);

      socketRef.current = io("https://shortchat-backend.onrender.com", {
        auth: { token },
      });

      socketRef.current.on("receive_message", (data) => {
        if (
          (data.sender === selectedUser?._id && data.receiver === normalizedUser._id) ||
          (data.sender === normalizedUser._id && data.receiver === selectedUser?._id)
        ) {
          setChat((prev) => [...prev, data]);
        }
      });

      fetchUsers(normalizedUser._id);

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user?._id && selectedUser?._id) {
      fetchMessages();
    }
  }, [user, selectedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const fetchUsers = async (loggedInUserId) => {
    try {
      const res = await api.get("/user/all");
      const filtered = res.data.filter((u) => u._id !== loggedInUserId);
      setUsers(filtered);

      if (!filtered.find((u) => u._id === selectedUser?._id)) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  const fetchMessages = async () => {
    if (!user?._id || !selectedUser?._id) return;

    try {
      const res = await api.get(`/messages/${user._id}/${selectedUser._id}`);
      setChat(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !user?._id || !selectedUser?._id) return;

    const msg = {
      sender: user._id,
      receiver: selectedUser._id,
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      socketRef.current?.emit("send_message", msg);
      const res = await api.post("/messages", msg);
      setChat((prev) => [...prev, res.data]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setChat((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 to-purple-100 p-4 flex flex-col md:flex-row gap-4 font-sans">
      {/* Users Sidebar */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Chats</h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                setMessage("");
              }}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${
                selectedUser?._id === u._id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="w-10 h-10 bg-blue-300 text-white font-semibold flex items-center justify-center rounded-full shadow-sm">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm md:text-base font-medium">{u.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-4 flex flex-col h-[90vh] overflow-hidden">
        <div className="border-b pb-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user to start chatting"}
          </h2>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-2 py-1 space-y-3 mb-3"
        >
          {chat.map((msg, idx) => (
            <div
              key={idx}
              title="Click to delete"
              onClick={() =>
                window.confirm("Delete this message?") && deleteMessage(msg._id)
              }
              className={`flex flex-col max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-md cursor-pointer transition-opacity hover:opacity-80 ${
                msg.sender === user?._id
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              <div>{msg.content}</div>
              <div className="text-[10px] mt-1 text-right opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="flex items-center gap-2 mt-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
