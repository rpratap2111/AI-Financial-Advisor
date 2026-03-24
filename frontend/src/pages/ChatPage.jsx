import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

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

  // Load all sessions from Firestore on mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "sessions"), 
            where("userId", "==", user.uid),
            orderBy("updatedAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const fetchedSessions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSessions(fetchedSessions);
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      } else {
        setSessions([]);
        setMessages([defaultMessage]);
        setCurrentSessionId(null);
      }
    };
    fetchSessions();
  }, [user]);

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

  const deleteSession = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "sessions", id));
      const newSessions = sessions.filter(s => s.id !== id);
      setSessions(newSessions);
      if (currentSessionId === id) startNewChat();
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const saveToFirestore = async (msgs, currentPersona) => {
    if (!user) return;
    
    try {
      if (!currentSessionId) {
        // Create new session
        const firstUserMsg = msgs.find(m => m.role === 'user')?.text || "New Chat";
        const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + "..." : firstUserMsg;
        
        const docRef = await addDoc(collection(db, "sessions"), {
          userId: user.uid,
          title,
          messages: msgs,
          persona: currentPersona,
          updatedAt: serverTimestamp()
        });
        
        const newSession = { 
          id: docRef.id, 
          title, 
          messages: msgs, 
          persona: currentPersona, 
          updatedAt: Date.now() 
        };
        
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(docRef.id);
      } else {
        // Update existing session
        const sessionRef = doc(db, "sessions", currentSessionId);
        await updateDoc(sessionRef, {
          messages: msgs,
          persona: currentPersona,
          updatedAt: serverTimestamp()
        });
        
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: msgs, persona: currentPersona, updatedAt: Date.now() } 
            : s
        ));
      }
    } catch (error) {
      console.error("Error saving session:", error);
    }
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
      await saveToFirestore(finalMessages, persona);
      
    } catch (err) {
      const finalMessages = [...newMessages, { role: "assistant", text: "Error communicating with the server." }];
      setMessages(finalMessages);
      await saveToFirestore(finalMessages, persona);
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
    <div className="flex bg-[#0b0f19] text-white h-screen pt-[72px] overflow-hidden relative">
      
      {/* Sidebar - Backdrop Blur & Mobile Slide-in */}
      <div className={`fixed md:relative z-40 h-[calc(100vh-72px)] w-80 bg-[#111827]/95 backdrop-blur-2xl border-r border-gray-800/50 flex flex-col p-6 transition-all duration-500 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <button 
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-2xl font-bold transition-all mb-8 shadow-xl shadow-indigo-500/20 active:scale-95 group"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span> 
          <span className="text-sm tracking-wide">New Session</span>
        </button>

        <div className="text-[10px] font-black text-gray-500 mb-4 px-2 uppercase tracking-[0.3em]">History</div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroller">
          {sessions.length === 0 ? (
            <div className="text-sm text-gray-500 italic px-4 py-10 text-center bg-gray-900/40 rounded-3xl border border-gray-800/30">No history yet</div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`group flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer transition-all border ${currentSessionId === session.id ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-lg' : 'text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-gray-200'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentSessionId === session.id ? 'bg-indigo-400' : 'bg-gray-700'}`}></div>
                  <span className="truncate text-xs font-semibold">{session.title}</span>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-500/10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto h-[calc(100vh-72px)] overflow-hidden">
        
        {/* Header with Sidebar Toggle & Persona Selector */}
        <div className="w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-0 gap-3 border-b border-gray-800/30 md:border-none">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              className="md:hidden p-2.5 bg-gray-800/80 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={persona}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`text-base md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${themeColors[persona]} truncate`}
              >
                {persona === 'professional' ? "AI Assistant" : 
                 persona === 'savage' ? "Roast Mode" : 
                 "Gen-Z Mode"}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="flex bg-gray-900/80 p-1 rounded-full border border-gray-800/50 shadow-inner scale-90 md:scale-100 origin-right">
            {(['professional', 'savage', 'genz']).map((p) => (
              <button 
                key={p}
                onClick={() => setPersona(p)} 
                className={`px-3 md:px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 ${persona === p ? `${bubbleColors[p]} text-white shadow-xl scale-105` : 'text-gray-500 hover:text-gray-300'}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box - More Modern Bubble Styles */}
        <div className="w-full flex-1 flex flex-col overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10"></div>
          
          <div ref={scrollRef} className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 scroller scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] md:max-w-[80%] px-5 py-4 rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-lg transition-all duration-500 ${
                    msg.role === "user" 
                      ? `${bubbleColors[persona]} text-white rounded-br-none border-b-2 border-r-2 border-white/10` 
                      : "bg-gray-800/50 text-gray-200 border border-white/5 rounded-bl-none backdrop-blur-sm markdown-body prose prose-invert max-w-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    <span className="font-medium tracking-wide">{msg.text}</span>
                  ) : (
                    <div className="opacity-90"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 border border-white/5 p-4 rounded-3xl rounded-bl-none flex items-center space-x-2 h-14 px-8 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-8 bg-black/40 backdrop-blur-2xl border-t border-white/5">
            {messages.length === 1 && !input && (
              <div className="flex flex-wrap justify-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(p)}
                    className="text-[10px] md:text-xs bg-gray-800/60 hover:bg-indigo-600/40 hover:border-indigo-500/50 text-gray-300 px-4 py-2 rounded-full transition-all border border-gray-700/50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex gap-3 w-full max-w-4xl mx-auto items-center">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-gray-800/40 border border-white/10 text-white rounded-2xl px-6 py-4 md:py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-2xl placeholder:text-gray-500 text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="relative overflow-hidden w-14 h-14 md:w-auto md:px-10 md:h-[62px] rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale group flex items-center justify-center font-black uppercase tracking-widest text-xs md:text-sm"
              >
                <AnimatePresence>
                  <motion.div
                    key={persona}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-br ${themeColors[persona]}`}
                  />
                </AnimatePresence>
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <span className="hidden md:block">Send Message</span>
                  <svg className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
