import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const { user } = useAuth();
  const defaultMessage = { role: "assistant", text: "Hello! I am your AI Financial Advisor. How can I help you today?" };
  
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  const [persona, setPersona] = useState('professional');
  const [messages, setMessages] = useState([defaultMessage]);
  const allPrompts = [
    "What should be the size of my emergency fund?",
    "Explain compound interest simply.",
    "Should I invest in gold right now?",
    "How to start investing with ₹5000 a month?",
    "Mutual funds vs individual stocks?",
    "What are good tax saving instruments?",
    "Explain the 50/30/20 budgeting rule.",
    "How much term insurance do I need?",
    "Is it better to rent or buy a house?",
    "What is SIP and why is it recommended?"
  ];

  const getRandomPrompts = () => {
    return [...allPrompts].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const [suggestedPrompts, setSuggestedPrompts] = useState(getRandomPrompts());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load all sessions on mount
  useEffect(() => {
    if (user) {
      const savedSessions = localStorage.getItem(`chat_sessions_${user.uid}`);
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      }
    } else {
      setSessions([]);
      setMessages([defaultMessage]);
      setCurrentSessionId(null);
    }
  }, [user]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([defaultMessage]);
    setPersona('professional');
    setSuggestedPrompts(getRandomPrompts());
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      setPersona(session.persona || 'professional');
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (user) localStorage.setItem(`chat_sessions_${user.uid}`, JSON.stringify(newSessions));
    if (currentSessionId === id) startNewChat();
  };

  const saveSession = (msgs, currentPersona) => {
    if (!user) return;
    
    let sessionId = currentSessionId;
    let newSessions = [...sessions];
    
    if (!sessionId) {
      sessionId = generateId();
      setCurrentSessionId(sessionId);
      // Generate a title based on the user's first prompt
      const firstUserMsg = msgs.find(m => m.role === 'user')?.text || "New Chat";
      const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + "..." : firstUserMsg;
      
      newSessions.unshift({ id: sessionId, title, messages: msgs, persona: currentPersona, updatedAt: Date.now() });
    } else {
      const sessionIndex = newSessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        newSessions[sessionIndex].messages = msgs;
        newSessions[sessionIndex].persona = currentPersona;
        newSessions[sessionIndex].updatedAt = Date.now();
      }
    }
    
    // Sort so most recent is on top
    newSessions.sort((a, b) => b.updatedAt - a.updatedAt);
    setSessions(newSessions);
    localStorage.setItem(`chat_sessions_${user.uid}`, JSON.stringify(newSessions));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages, persona: persona })
      });
      const data = await res.json();
      
      let finalMessages;
      if (res.ok) {
        finalMessages = [...newMessages, { role: "assistant", text: data.reply }];
      } else {
        finalMessages = [...newMessages, { role: "assistant", text: `Error: ${data.error}` }];
      }
      setMessages(finalMessages);
      saveSession(finalMessages, persona);
      
    } catch (err) {
      const finalMessages = [...newMessages, { role: "assistant", text: "Error communicating with the server." }];
      setMessages(finalMessages);
      saveSession(finalMessages, persona);
    } finally {
      setLoading(false);
    }
  };

  const themeColors = {
    professional: "from-blue-400 to-emerald-400",
    savage: "from-red-500 to-orange-500",
    genz: "from-purple-500 to-pink-500"
  };

  const bubbleColors = {
    professional: "bg-blue-600",
    savage: "bg-red-600",
    genz: "bg-purple-600"
  };

  return (
    <div className="flex bg-[#0b0f19] text-white h-screen pt-[72px] overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden absolute top-20 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed md:relative z-40 h-full w-72 bg-[#111827] border-r border-gray-800 flex flex-col p-4 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <button 
          onClick={startNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors mb-6 shadow-lg shadow-indigo-500/20"
        >
          <span className="text-xl">+</span> New Chat
        </button>

        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Previous Chats</div>
        
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 scroller">
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-500 italic px-2">No history yet</div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors text-sm ${currentSessionId === session.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="truncate">{session.title}</span>
                </div>
                {/* Delete Button */}
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center p-4 md:p-6 w-full max-w-5xl mx-auto h-[calc(100vh-72px)]">
        
        {/* Persona Selector Header */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-4 gap-4 pl-12 md:pl-0">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={persona}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${themeColors[persona]}`}
            >
              {persona === 'professional' ? "AI Financial Assistant" : 
               persona === 'savage' ? "🔥 Savage Roast Mode" : 
               "✨ Gen-Z Finance"}
            </motion.h2>
          </AnimatePresence>
          <div className="flex space-x-1 sm:space-x-2 bg-gray-900 p-1.5 rounded-full border border-gray-800 shadow-lg">
            <button onClick={() => setPersona('professional')} className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${persona === 'professional' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Professional</button>
            <button onClick={() => setPersona('savage')} className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${persona === 'savage' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Savage</button>
            <button onClick={() => setPersona('genz')} className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${persona === 'genz' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Gen-Z</button>
          </div>
        </div>

        {/* Chat Box */}
        <div className={`w-full flex-1 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500`}>
          
          <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-5 scroller">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-3xl text-sm md:text-base leading-relaxed shadow-sm transition-colors duration-500 ease-in-out ${
                    msg.role === "user" 
                      ? `${bubbleColors[persona]} text-white rounded-br-sm` 
                      : "bg-[#1f2937] text-gray-200 border border-gray-700/50 rounded-bl-sm markdown-body prose prose-invert max-w-none"
                  }`}
                >
                  {msg.role === "user" ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1f2937] border border-gray-700/50 p-4 rounded-3xl rounded-bl-sm flex items-center space-x-2 h-12 px-6">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 bg-gray-900/80 border-t border-gray-800 relative">
            {messages.length === 1 && (
              <div className="absolute bottom-[110%] left-0 w-full flex flex-wrap justify-center gap-2 p-2">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(p)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full transition-colors border border-gray-700 shadow-lg"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="flex space-x-3 w-full max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your financial advisor anything..."
                className="flex-1 bg-gray-800/80 border border-gray-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="relative overflow-hidden text-white font-bold py-4 px-6 md:px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                <AnimatePresence>
                  <motion.div
                    key={persona}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-r ${themeColors[persona]}`}
                  />
                </AnimatePresence>
                <span className="relative z-10 flex items-center justify-center w-full h-full">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default ChatPage;
