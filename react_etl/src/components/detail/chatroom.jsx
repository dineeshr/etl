import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/chatroom.css";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatRoom = ({ issueId, username, disabled }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isOpen, setIsOpen] = useState(localStorage.getItem("chatOpen") === "true");
    const chatBoxRef = useRef(null); // Ref for the chat container

    useEffect(() => {
        if (issueId) fetchMessages();
    }, [issueId]);

    useEffect(() => {
        localStorage.setItem("chatOpen", isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Ensure the chat scrolls to the bottom when messages update
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/${issueId}`);
            setMessages((prevMessages) => {
                const newMessages = response.data.filter(
                    (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
                );
                return [...prevMessages, ...newMessages];
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (messageInput.trim() === "") return;
        try {
            const response = await axios.post("http://localhost:8080/chat/send", {
                issueId: issueId, // ✅ Corrected this
                sender: username,
                message: messageInput,
            });
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setMessageInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button className="chat-button" disabled={disabled} onClick={() => setIsOpen(true)}>
                    <FaComments size={24} />
                </button>
            )}

            {/* Chat Container */}
            <div className={`chat-container ${isOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <h4>Issue #{issueId}</h4>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="chat-box" ref={chatBoxRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender === username ? "sent" : "received"}`}>
                            <strong>{msg.sender}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage} className="send-button">
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatRoom;
