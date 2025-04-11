import React, { useState, useRef, useEffect } from 'react';
import { 
  Plane, Send, RotateCcw, Radar, Wind, Gauge,
  Loader2, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
  status?: 'sending' | 'sent' | 'error';
  sessionId?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Welcome to the Airbus Technical Assistant! I specialize in Airbus specifications, systems, and procedures. What would you like to know about this remarkable aircraft?',
      sessionId: Date.now().toString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      type: 'user', 
      content: input, 
      status: 'sending',
      sessionId: currentSessionId 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setInput('');

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev.map(msg => 
          msg === userMessage ? { ...msg, status: 'sent' } : msg
        ),
        { type: 'bot', content: data.answer, sessionId: currentSessionId }
      ]);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev.map(msg => 
          msg === userMessage ? { ...msg, status: 'error' } : msg
        ),
        { type: 'bot', content: "Error: Unable to connect to server", status: 'error', sessionId: currentSessionId }
      ]);
    }
  };

  const clearChat = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([{
      type: 'bot',
      content: 'Welcome to the Airbus Technical Assistant! I specialize in Airbus specifications, systems, and procedures. What would you like to know about this remarkable aircraft?',
      sessionId: newSessionId
    }]);
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-white relative overflow-hidden">
      {/* Initial Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a2332] border border-sky-900/50 rounded-lg p-6 max-w-md mx-4">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-sky-400 hover:text-sky-300"
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="text-sky-400" size={24} />
              <h3 className="text-lg font-semibold text-sky-400">Important Notice</h3>
            </div>
            <p className="text-gray-300">
              If a question is not answered due to an error, please try again as the backend server might have timed out due to some constraints.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-sky-600 hover:bg-sky-500 text-white py-2 px-4 rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -top-[400px] -left-[400px] animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -bottom-[300px] -right-[300px] animate-pulse delay-700"></div>
        <div className="absolute w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl top-[40%] left-[60%] animate-pulse delay-1000"></div>
      </div>

      {/* Background Image with Parallax Effect */}
      <div 
        className="fixed inset-0 z-[1] opacity-5 bg-blend-overlay transform transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-sky-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Plane className="text-sky-400 transform group-hover:rotate-12 transition-transform duration-300" size={28} />
                  <div className="absolute inset-0 bg-sky-400/20 rounded-full animate-pulse-ring"></div>
                </div>
                <h1 className="text-xl md:text-2xl font-bold gradient-text">
                  Airbus Expert
                </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1 hover:text-sky-400 transition-colors cursor-pointer">
                  <Radar size={16} />
                  <span>Systems</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-sky-400 transition-colors cursor-pointer">
                  <Wind size={16} />
                  <span>Performance</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-sky-400 transition-colors cursor-pointer">
                  <Gauge size={16} />
                  <span>Operations</span>
                </div>
              </nav>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-md bg-sky-950 hover:bg-sky-900 transition-colors border border-sky-800/50 group"
            >
              <RotateCcw size={16} className="text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden md:inline">New Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] relative z-10">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-custom">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-appear`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[90%] md:max-w-[80%] mr-3 rounded-lg p-3 md:p-4 glass-effect ${
                  message.type === 'user'
                    ? 'bg-sky-600/90 text-white border border-sky-500/50'
                    : 'border border-sky-900/50'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative">
                      <Plane size={16} className="text-sky-400" />
                      <div className="absolute inset-0 bg-sky-400/20 rounded-full animate-pulse-ring"></div>
                    </div>
                    <span className="font-semibold text-sky-400">Airbus Technical Assistant</span>
                  </div>
                )}
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">{message.content}</p>
                {message.status === 'sending' && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-sky-400">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Sending...</span>
                  </div>
                )}
                {message.status === 'error' && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-red-400">
                    <AlertCircle size={12} />
                    <span>Error sending message</span>
                  </div>
                )}
                {message.status === 'sent' && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span>Sent</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start message-appear">
              <div className="max-w-[90%] md:max-w-[80%] rounded-lg p-3 md:p-4 glass-effect border border-sky-900/50">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Plane size={16} className="text-sky-400" />
                    <div className="absolute inset-0 bg-sky-400/20 rounded-full animate-pulse-ring"></div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2 glass-effect p-3 md:p-4 rounded-lg border border-sky-900/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Airbus systems..."
            className="flex-1 bg-sky-950/50 border border-sky-800/50 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-white placeholder-sky-400/50 text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 font-medium ${
              input.trim() && !isTyping
                ? 'bg-sky-600 hover:bg-sky-500 text-white'
                : 'bg-sky-950 text-sky-400/50 cursor-not-allowed'
            }`}
          >
            <Send size={18} className={input.trim() ? 'transform hover:translate-x-1 transition-transform' : ''} />
            <span className="hidden md:inline">Send</span>
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;