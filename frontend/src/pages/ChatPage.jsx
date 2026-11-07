import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, PanelLeft, Plus, Trash2 } from "lucide-react";
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
  const defaultMessage = { role: "assistant", text: "I am your AI Financial Advisor. Ask me about saving, investing or credit" };
  
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  const [persona, setPersona] = useState('professional');
  const [messages, setMessages] = useState([defaultMessage]);
  const allPrompts = [
    "What should be the size of my emergency fund?",
    "Explain compound interest simply",
    "Should I invest in gold right now?",
    "How to start investing with ₹5000 a month?",
    "Mutual funds vs individual stocks?",
    "What are good tax saving instruments?",
    "Explain the 50/30/20 budgeting rule",
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
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

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

  // Heartbeat to keep Render server awake
  useEffect(() => {
    const pingServer = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        await fetch(`${API_URL}/ping`);
        console.log("Server heartbeat sent");
      } catch (err) {
        console.error("Heartbeat failed", err);
      }
    };

    // Ping immediately and then every 10 minutes
    pingServer();
    const interval = setInterval(pingServer, 10 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages, 
          persona: persona 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect to server");
      }

      // Add a placeholder message for the assistant that we will update
      const assistantId = Date.now();
      setMessages(prev => [...prev, { role: "assistant", text: "", id: assistantId }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // Update the last message in real-time
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex].role === "assistant") {
            updated[lastIndex].text = fullContent;
          }
          return updated;
        });
      }

      // Save the final complete message to Firestore
      const finalMessages = [...newMessages, { role: "assistant", text: fullContent }];
      await saveToFirestore(finalMessages, persona);

    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = { role: "assistant", text: `Error: ${err.message || "Failed to connect to the server."}` };
      const finalWithErrors = [...newMessages, errorMsg];
      setMessages(finalWithErrors);
      await saveToFirestore(finalWithErrors, persona);
    } finally {
      setLoading(false);
    }
  };

  const personaTitles = {
    professional: "AI assistant",
    savage: "Roast mode",
    genz: "Gen-Z mode"
  };

  const personaLabels = {
    professional: "Professional",
    savage: "Savage",
    genz: "Gen-Z"
  };

  const lastMessage = messages[messages.length - 1];
  const isThinking = loading && (lastMessage.role === "user" || !lastMessage.text);

  return (
    <div className="relative flex h-[calc(100dvh-4rem)] overflow-hidden">

      {/* Sidebar */}
      <div className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-deep p-3 transition-transform duration-300 ease-out md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={startNewChat} className="btn btn-secondary h-9 w-full">
          <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
          New session
        </button>

        <div className="mt-6 mb-2 px-2 text-xs leading-4 text-fg-3">History</div>

        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="px-2 py-2 text-sm text-fg-3">No history yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex h-9 shrink-0 items-center rounded-lg transition-colors duration-150 ${currentSessionId === session.id ? "bg-raised text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "text-fg-2 hover:bg-card hover:text-fg"}`}
              >
                <button
                  onClick={() => loadSession(session.id)}
                  className="h-full min-w-0 flex-1 truncate rounded-lg pl-2 text-left text-sm"
                >
                  {session.title}
                </button>
                <button
                  onClick={(e) => deleteSession(e, session.id)}
                  aria-label={`Delete ${session.title}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-fg-3 transition-[color,opacity] duration-150 hover:text-bad focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header with sidebar toggle and persona selector */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              className="-ml-2 p-2 text-fg-2 transition-colors duration-150 hover:text-fg md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle history"
              aria-expanded={sidebarOpen}
            >
              <PanelLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <h1 className="truncate text-base font-medium">{personaTitles[persona]}</h1>
          </div>

          <div className="flex shrink-0 gap-0.5 rounded-lg border border-line bg-card p-0.5">
            {(['professional', 'savage', 'genz']).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                aria-pressed={persona === p}
                className={`h-7 rounded-md px-2 text-xs transition-colors duration-150 sm:px-3 sm:text-[13px] ${persona === p ? "bg-raised text-fg" : "text-fg-2 hover:text-fg"}`}
              >
                {personaLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((msg, idx) => {
              if (msg.role !== "user" && !msg.text) return null;

              return msg.role === "user" ? (
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[88%] rounded-xl bg-raised px-4 py-3 text-sm leading-6 whitespace-pre-wrap md:max-w-[80%]">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={idx} className="markdown-body text-sm leading-6 text-fg">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              );
            })}
            {isThinking && (
              <p role="status" className="animate-pulse text-sm leading-6 text-fg-3">Thinking</p>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-line px-4 py-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            {messages.length === 1 && !input && (
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(p)}
                    className="rounded-lg border border-line px-3 py-1.5 text-left text-[13px] leading-5 text-fg-2 transition-colors duration-150 hover:border-line-strong hover:text-fg"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message"
                aria-label="Message"
                className="field h-11 flex-1"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="btn btn-primary w-11 px-0 md:w-auto md:px-5"
              >
                <span className="hidden md:block">Send</span>
                <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-30 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
