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
  FaUserCircle, 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { MdMessage, MdNotifications } from "react-icons/md";

var socket;

const Chats = () => {
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showRequests, setShowRequests] = useState(null);
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

  // Skill Energy Color Palette
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
    socket = io(axios.defaults.baseURL);
    if (user) {
      socket.emit("setup", user);
    }
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("New Message Recieved: ", newMessageRecieved);
      if (selectedChat && selectedChat.id === newMessageRecieved.chatId._id) {
        setChatMessages((prevState) => [...prevState, newMessageRecieved]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const tempUser = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get("http://localhost:8000/chat");
      toast.success(data.message);
      if (tempUser?._id) {
        const temp = data.data.map((chat) => {
          return {
            id: chat._id,
            name: chat?.users.find((u) => u?._id !== tempUser?._id).name,
            picture: chat?.users.find((u) => u?._id !== tempUser?._id).picture,
            username: chat?.users.find((u) => u?._id !== tempUser?._id).username,
          };
        });
        setChats(temp);
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleScheduleClick = () => {
    setScheduleModalShow(true);
  };

  const handleChatClick = async (chatId) => {
    try {
      setChatMessageLoading(true);
      const { data } = await axios.get(`http://localhost:8000/message/getMessages/${chatId}`);
      setChatMessages(data.data);
      setMessage("");
      const chatDetails = chats.find((chat) => chat.id === chatId);
      setSelectedChat(chatDetails);
      socket.emit("join chat", chatId);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    try {
      socket.emit("stop typing", selectedChat._id);
      if (message === "") {
        toast.error("Message is empty");
        return;
      }
      const { data } = await axios.post("/message/sendMessage", { chatId: selectedChat.id, content: message });
      socket.emit("new message", data.data);
      setChatMessages((prevState) => [...prevState, data.data]);
      setMessage("");
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getRequests = async () => {
    try {
      setRequestLoading(true);
      const { data } = await axios.get("/request/getRequests");
      setRequests(data.data);
      console.log(data.data);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setRequestLoading(false);
    }
  };

  const handleTabClick = async (tab) => {
    if (tab === "chat") {
      setShowChatHistory(true);
      setShowRequests(false);
      await fetchChats();
    } else if (tab === "requests") {
      setShowChatHistory(false);
      setShowRequests(true);
      await getRequests();
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setRequestModalShow(true);
  };

  const handleRequestAccept = async (e) => {
    console.log("Request accepted");
    try {
      setAcceptRequestLoading(true);
      const { data } = await axios.post("/request/acceptRequest", { requestId: selectedRequest._id });
      console.log(data);
      toast.success(data.message);
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id));
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  const handleRequestReject = async () => {
    console.log("Request rejected");
    try {
      setAcceptRequestLoading(true);
      const { data } = await axios.post("/request/rejectRequest", { requestId: selectedRequest._id });
      console.log(data);
      toast.success(data.message);
      setRequests((prevState) => prevState.filter((request) => request._id !== selectedRequest._id));
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
      setRequestModalShow(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    background: colors.background,
    padding: "20px",
  };

  const mainGridStyle = {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "20px",
    maxWidth: "1600px",
    margin: "0 auto",
    height: "calc(100vh - 40px)",
  };

  const sidebarStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: `3px solid ${colors.primary}`,
    boxShadow: `0 10px 40px rgba(255, 107, 107, 0.15)`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const tabsContainerStyle = {
    display: "flex",
    padding: "15px 15px 0",
    gap: "10px",
  };

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: "14px 20px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: isActive ? "#FFFFFF" : colors.text,
    background: isActive ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` : "transparent",
    border: `2px solid ${isActive ? colors.primary : colors.background}`,
    borderRadius: "12px 12px 0 0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  });

  const chatListStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    background: colors.background,
  };

  const chatItemStyle = (isSelected) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    marginBottom: "10px",
    background: isSelected ? `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)` : "#FFFFFF",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `2px solid ${isSelected ? colors.accent : "transparent"}`,
    boxShadow: isSelected ? `0 8px 20px rgba(29, 211, 176, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.05)",
  });

  const chatAvatarStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: `2px solid ${colors.accent}`,
    objectFit: "cover",
  };

  const chatNameStyle = (isSelected) => ({
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: isSelected ? "#FFFFFF" : colors.text,
  });

  const chatContainerStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: `3px solid ${colors.accent}`,
    boxShadow: `0 10px 40px rgba(29, 211, 176, 0.15)`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const chatHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 25px",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    borderBottom: `3px solid ${colors.accent}`,
  };

  const profileInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const headerAvatarStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "3px solid #FFFFFF",
    objectFit: "cover",
  };

  const headerNameStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#FFFFFF",
  };

  const videoButtonStyle = {
    padding: "12px 25px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: colors.text,
    background: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  };

  const messagesContainerStyle = {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    background: colors.background,
  };

  const messageStyle = (isSender) => ({
    display: "flex",
    justifyContent: isSender ? "flex-end" : "flex-start",
    marginBottom: "15px",
  });

  const messageBubbleStyle = (isSender) => ({
    maxWidth: "70%",
    padding: "12px 18px",
    borderRadius: isSender ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: isSender 
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : colors.accent,
    color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 500,
    lineHeight: "1.5",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
  });

  const inputContainerStyle = {
    display: "flex",
    gap: "12px",
    padding: "20px 25px",
    background: "#FFFFFF",
    borderTop: `2px solid ${colors.background}`,
  };

  const messageInputStyle = {
    flex: 1,
    padding: "14px 18px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    border: `2px solid ${colors.background}`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const sendButtonStyle = {
    padding: "14px 30px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#FFFFFF",
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: `0 8px 20px rgba(29, 211, 176, 0.3)`,
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    background: "#FFFFFF",
    borderRadius: "25px",
    padding: "40px",
    maxWidth: "500px",
    width: "90%",
    border: `3px solid ${colors.primary}`,
    boxShadow: `0 20px 60px rgba(255, 107, 107, 0.3)`,
  };

  const modalTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: colors.text,
    marginBottom: "30px",
    textAlign: "center",
  };

  const formGroupStyle = {
    marginBottom: "25px",
  };

  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: colors.text,
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const formInputStyle = {
    width: "100%",
    padding: "12px 15px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    border: `2px solid ${colors.background}`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const modalButtonsStyle = {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  };

  const primaryButtonStyle = {
    flex: 1,
    padding: "14px 25px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#FFFFFF",
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: `0 8px 20px rgba(29, 211, 176, 0.3)`,
  };

  const secondaryButtonStyle = {
    flex: 1,
    padding: "14px 25px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#FFFFFF",
    background: colors.secondary,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: `0 8px 20px rgba(255, 164, 27, 0.3)`,
  };

  const emptyStateStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: colors.text,
  };

  const emptyStateIconStyle = {
    fontSize: "5rem",
    color: colors.primary,
    marginBottom: "20px",
    opacity: 0.3,
  };

  const emptyStateTextStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.3rem",
    fontWeight: 600,
    color: colors.text,
    opacity: 0.6,
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .chat-item:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2) !important;
    }

    .video-call-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
    }

    .send-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(29, 211, 176, 0.4) !important;
    }

    .message-input:focus {
      border-color: ${colors.accent} !important;
      box-shadow: 0 0 0 3px rgba(29, 211, 176, 0.1);
    }

    .form-input:focus {
      border-color: ${colors.primary} !important;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }

    .primary-modal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(29, 211, 176, 0.4) !important;
    }

    .secondary-modal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 164, 27, 0.4) !important;
    }

    * {
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${colors.background};
    }

    ::-webkit-scrollbar-thumb {
      background: ${colors.primary};
      borderRadius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.accent};
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={containerStyle}>
        <div style={mainGridStyle}>
          {/* SIDEBAR */}
          <div style={sidebarStyle}>
            {/* Tabs */}
            <div style={tabsContainerStyle}>
              <button 
                style={tabButtonStyle(showChatHistory)} 
                onClick={() => handleTabClick("chat")}
              >
                <MdMessage /> Chats
              </button>
              <button 
                style={tabButtonStyle(!showChatHistory)} 
                onClick={() => handleTabClick("requests")}
              >
                <MdNotifications /> Requests
              </button>
            </div>

            {/* Chat List */}
            <div style={chatListStyle}>
              {showChatHistory && (
                <>
                  {chatLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                      <Spinner animation="border" style={{ color: colors.primary }} />
                    </div>
                  ) : (
                    <>
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className="chat-item"
                          style={chatItemStyle(selectedChat?.id === chat?.id)}
                          onClick={() => handleChatClick(chat.id)}
                        >
                          <img src={chat.picture} alt={chat.name} style={chatAvatarStyle} />
                          <span style={chatNameStyle(selectedChat?.id === chat?.id)}>{chat.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {showRequests && (
                <>
                  {requestLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                      <Spinner animation="border" style={{ color: colors.primary }} />
                    </div>
                  ) : (
                    <>
                      {requests.map((request) => (
                        <div
                          key={request._id}
                          className="chat-item"
                          style={chatItemStyle(selectedRequest?._id === request?._id)}
                          onClick={() => handleRequestClick(request)}
                        >
                          <img src={request.picture} alt={request.name} style={chatAvatarStyle} />
                          <span style={chatNameStyle(selectedRequest?._id === request?._id)}>{request.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* CHAT CONTAINER */}
          <div style={chatContainerStyle}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div style={chatHeaderStyle}>
                  <div style={profileInfoStyle}>
                    <img src={selectedChat.picture} alt={selectedChat.name} style={headerAvatarStyle} />
                    <span style={headerNameStyle}>{selectedChat.name}</span>
                  </div>
                  <button className="video-call-btn" style={videoButtonStyle} onClick={handleScheduleClick}>
                    <FaVideo /> Request Video Call
                  </button>
                </div>

                {/* Messages */}
                <div style={messagesContainerStyle}>
                  {chatMessageLoading ? (
                    <div style={emptyStateStyle}>
                      <Spinner animation="border" style={{ color: colors.primary, width: "3rem", height: "3rem" }} />
                    </div>
                  ) : (
                    <ScrollableFeed forceScroll={true}>
                      {chatMessages.map((msg, index) => (
                        <div key={index} style={messageStyle(msg.sender._id === user._id)}>
                          <div style={messageBubbleStyle(msg.sender._id === user._id)}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </ScrollableFeed>
                  )}
                </div>

                {/* Input */}
                <div style={inputContainerStyle}>
                  <input
                    className="message-input"
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    style={messageInputStyle}
                  />
                  <button className="send-btn" style={sendButtonStyle} onClick={sendMessage}>
                    <FaPaperPlane /> Send
                  </button>
                </div>
              </>
            ) : (
              <div style={emptyStateStyle}>
                <MdMessage style={emptyStateIconStyle} />
                <p style={emptyStateTextStyle}>Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Modal */}
        {scheduleModalShow && (
          <div style={modalOverlayStyle} onClick={() => setScheduleModalShow(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h3 style={modalTitleStyle}>Request a Video Meeting</h3>
              <form>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <FaCalendarAlt style={{ color: colors.primary }} /> Preferred Date
                  </label>
                  <input
                    className="form-input"
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    style={formInputStyle}
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>
                    <FaClock style={{ color: colors.primary }} /> Preferred Time
                  </label>
                  <input
                    className="form-input"
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    style={formInputStyle}
                  />
                </div>

                <div style={modalButtonsStyle}>
                  <button
                    className="primary-modal-btn"
                    type="submit"
                    style={primaryButtonStyle}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (scheduleForm.date === "" || scheduleForm.time === "") {
                        toast.error("Please fill all the fields");
                        return;
                      }
                      scheduleForm.username = selectedChat.username;
                      try {
                        const { data } = await axios.post("/user/sendScheduleMeet", scheduleForm);
                        toast.success("Request mail has been sent successfully!");
                        setScheduleForm({ date: "", time: "" });
                      } catch (error) {
                        console.log(error);
                        if (error?.response?.data?.message) {
                          toast.error(error.response.data.message);
                        } else {
                          toast.error("Something went wrong");
                        }
                      }
                      setScheduleModalShow(false);
                    }}
                  >
                    <FaCheckCircle /> Submit Request
                  </button>
                  <button
                    className="secondary-modal-btn"
                    type="button"
                    style={secondaryButtonStyle}
                    onClick={() => setScheduleModalShow(false)}
                  >
                    <FaTimesCircle /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Request Modal */}
        {requestModalShow && selectedRequest && (
          <div style={modalOverlayStyle} onClick={() => setRequestModalShow(false)}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <h3 style={modalTitleStyle}>Connection Request</h3>
              <RequestCard
                name={selectedRequest?.name}
                skills={selectedRequest?.skillsProficientAt}
                rating="4"
                picture={selectedRequest?.picture}
                username={selectedRequest?.username}
              />
              <div style={modalButtonsStyle}>
                <button
                  className="primary-modal-btn"
                  style={primaryButtonStyle}
                  onClick={handleRequestAccept}
                  disabled={acceptRequestLoading}
                >
                  {acceptRequestLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <><FaCheckCircle /> Accept</>
                  )}
                </button>
                <button
                  className="secondary-modal-btn"
                  style={secondaryButtonStyle}
                  onClick={handleRequestReject}
                  disabled={acceptRequestLoading}
                >
                  {acceptRequestLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <><FaTimesCircle /> Reject</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chats;
