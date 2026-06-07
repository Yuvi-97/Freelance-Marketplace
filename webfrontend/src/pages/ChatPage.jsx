import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiSend, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function ChatPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load project info + chat history
  useEffect(() => {
    const init = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Load project details
        const projRes = await axios.get(`${API_BASE}/api/projects/${projectId}`, { headers });
        setProject(projRes.data);

        // Load chat history
        const histRes = await axios.get(
          `${API_BASE}/api/chat/${projectId}/messages?userId=${userId}`,
          { headers }
        );
        setMessages(histRes.data);
      } catch (err) {
        setError(err?.response?.data || "Failed to load chat. You may not have access to this conversation.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [projectId, userId, token]);

  // Connect WebSocket
  useEffect(() => {
    const wsBase = API_BASE.replace(/^http/, "ws").replace(/^https/, "wss");
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${projectId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => {
            // Avoid duplicates (message may already be in history)
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [projectId]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !stompClientRef.current?.connected) return;

    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        projectId: Number(projectId),
        senderId: userId,
        content: trimmed,
      }),
    });
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Determine the other participant's name for the header
  const otherParticipant = () => {
    if (!project) return "Chat";
    const role = localStorage.getItem("role");
    if (role === "CLIENT") {
      return project.assignedFreelancer?.name || "Freelancer";
    }
    return project.client?.clientName || project.client?.user?.username || "Client";
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-lg font-bold mb-2">Access Denied</h2>
        <p className="text-sm">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600">
          <FiArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
          {otherParticipant().charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{otherParticipant()}</p>
          <p className="text-xs text-gray-500 truncate">
            Project: {project?.title}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}></div>
          <span className="text-xs text-gray-500">{connected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-16">
            <FiUser className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start the conversation below</p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender?.id === userId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isOwn && (
                  <span className="text-xs text-gray-500 px-1">{msg.sender?.username}</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 px-1">
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition max-h-32"
            style={{ minHeight: "44px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !connected}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <FiSend size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
