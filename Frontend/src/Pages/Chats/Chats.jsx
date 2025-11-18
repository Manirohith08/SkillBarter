import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";
import RequestCard from "./RequestCard";
import { 
  FaPaperPlane, 
  FaVideo, 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { MdMessage, MdNotifications } from "react-icons/md";

var socket;

const Chats = () => {
  const BACKEND_URL = axios.defaults.baseURL;
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || BACKEND_URL;

  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [acceptRequestLoading, setAcceptRequestLoading] = useState(false);

  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const [requestModalShow, setRequestModalShow] = useState(false);

  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatMessageLoading, setChatMessageLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
  });

  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
    if (user) {
      socket.emit("setup", user);
    }

    socket.on("message recieved", (newMessageRecieved) => {
      if (selectedChat && selectedChat.id === newMessageRecieved.chatId._id) {
        setChatMessages((prevState) => [...prevState, newMessageRecieved]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChat, user]);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const tempUser = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.get(`/chat`);
      if (tempUser?._id) {
        const formattedChats = data.data.map((chat) => {
          const otherUser = chat.users.find((u) => u._id !== tempUser._id);
          return {
            id: chat._id,
            name: otherUser?.name,
            picture: otherUser?.picture,
            username: otherUser?.username,
          };
        });
        setChats(formattedChats);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatClick = async (chatId) => {
    try {
      setChatMessageLoading(true);
      const { data } = await axios.get(`/message/getMessages/${chatId}`);
      setChatMessages(data.data);
      setMessage("");

      const chatDetails = chats.find((chat) => chat.id === chatId);
      setSelectedChat(chatDetails);

      socket.emit("join chat", chatId);

    } catch (err) {
      handleError(err);
    } finally {
      setChatMessageLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return toast.error("Message is empty");

    try {
      const { data } = await axios.post(`/message/sendMessage`, {
        chatId: selectedChat.id,
        content: message,
      });

      socket.emit("new message", data.data);
      setChatMessages((prev) => [...prev, data.data]);
      setMessage("");

    } catch (err) {
      handleError(err);
    }
  };

  const getRequests = async () => {
    try {
      setRequestLoading(true);
      const { data } = await axios.get(`/request/getRequests`);
      setRequests(data.data);
    } catch (err) {
      handleError(err);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleTabClick = async (tab) => {
    setShowChatHistory(tab === "chat");
    setShowRequests(tab === "requests");

    tab === "chat" ? fetchChats() : getRequests();
  };

  const handleRequestAccept = async () => {
    try {
      setAcceptRequestLoading(true);
      await axios.post(`/request/acceptRequest`, {
        requestId: selectedRequest._id,
      });
      setRequests((prev) =>
        prev.filter((req) => req._id !== selectedRequest._id)
      );
      toast.success("Request accepted!");
    } catch (err) {
      handleError(err);
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  const handleRequestReject = async () => {
    try {
      setAcceptRequestLoading(true);
      await axios.post(`/request/rejectRequest`, {
        requestId: selectedRequest._id,
      });
      setRequests((prev) =>
        prev.filter((req) => req._id !== selectedRequest._id)
      );
      toast.success("Request rejected!");
    } catch (err) {
      handleError(err);
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  const handleError = async (err) => {
    console.log(err);
    if (err?.response?.data?.message === "Please Login") {
      localStorage.removeItem("userInfo");
      setUser(null);
      await axios.get("/auth/logout");
      navigate("/login");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: "100vh", background: colors.background, padding: "20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "20px",
          height: "calc(100vh - 50px)"
        }}>
          
          {/* ---------- LEFT SIDE ---------- */}
          <div style={{ background: "#fff", borderRadius: "15px", border: "2px solid #ddd" }}>

            {/* Tabs */}
            <div style={{ display: "flex" }}>
              <button onClick={() => handleTabClick("chat")} style={{ flex: 1, padding: 12 }}>
                Chats
              </button>
              <button onClick={() => handleTabClick("requests")} style={{ flex: 1, padding: 12 }}>
                Requests
              </button>
            </div>

            {/* LIST */}
            <div style={{ padding: 15, overflowY: "auto", height: "100%" }}>
              {showChatHistory &&
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      cursor: "pointer",
                      background: selectedChat?.id === chat.id ? colors.accent : "#f5f5f5",
                      borderRadius: "10px",
                      marginBottom: 10,
                    }}
                  >
                    <img
                      src={chat.picture}
                      style={{ width: 45, height: 45, borderRadius: "50%" }}
                    />
                    <span style={{ fontWeight: 600 }}>{chat.name}</span>
                  </div>
                ))}

              {showRequests &&
                requests.map((request) => (
                  <div
                    key={request._id}
                    onClick={() => {
                      setSelectedRequest(request);
                      setRequestModalShow(true);
                    }}
                    style={{
                      background: "#eee",
                      padding: 12,
                      borderRadius: "10px",
                      marginBottom: 10,
                      cursor: "pointer",
                    }}
                  >
                    {request.name}
                  </div>
                ))}
            </div>
          </div>

          {/* --------- RIGHT CHAT AREA --------- */}
          <div style={{ background: "#fff", borderRadius: "15px", border: "2px solid #ddd" }}>
            {!selectedChat ? (
              <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                Select a chat to start messaging
              </div>
            ) : (
              <>
                {/* CHAT HEADER */}
                <div style={{ background: colors.primary, padding: 15, color: "#fff" }}>
                  {selectedChat.name}
                </div>

                {/* CHAT MESSAGES */}
                <div style={{ flex: 1, overflowY: "auto", padding: 15 }}>
                  <ScrollableFeed>
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.sender._id === user._id ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            background:
                              msg.sender._id === user._id
                                ? colors.secondary
                                : colors.accent,
                            padding: "10px 15px",
                            borderRadius: "10px",
                            marginBottom: 10,
                            maxWidth: "65%",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </ScrollableFeed>
                </div>

                {/* INPUT AREA */}
                <div style={{ padding: 15, display: "flex", gap: 10 }}>
                  <input
                    style={{ flex: 1, padding: 10 }}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button style={{ padding: "10px 20px", background: colors.accent, color: "#fff" }} onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chats;
