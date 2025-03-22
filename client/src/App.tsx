import React, { useState } from 'react';
import { Plane, Send, RotateCcw, Radar, Wind, Gauge } from 'lucide-react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Welcome to the A320 Technical Assistant! I specialize in Airbus A320 specifications, systems, and procedures. What would you like to know about this remarkable aircraft?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
  
    try {
      const response = await fetch("https://airbus-chat-bot.vercel.app/chat", {
        method: "POST", // ✅ Ensure this is POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
  
  
      const data = await response.json();
      const botMessage = { type: 'bot', content: data.answer };
  
      setMessages((prev: Message[]) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessages(prev => [...prev, { type: 'bot', content: "Error: Unable to connect to server" }]);
    }
  
    setInput('');
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Welcome to the A320 Technical Assistant! I specialize in Airbus A320 specifications, systems, and procedures. What would you like to know about this remarkable aircraft?'
    }]);
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#0f1623]/80 border-b border-sky-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Plane className="text-sky-400" size={28} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  A320 Expert
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-sky-400/80">
                <div className="flex items-center space-x-1">
                  <Radar size={16} />
                  <span>Systems</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind size={16} />
                  <span>Performance</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Gauge size={16} />
                  <span>Operations</span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-sky-950 hover:bg-sky-900 transition-colors border border-sky-800/50"
            >
              <RotateCcw size={16} className="text-sky-400" />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)] relative z-10">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4
          scrollbar scrollbar-track-sky-950/30 scrollbar-thumb-sky-400/50 
          hover:scrollbar-thumb-sky-400/70 scrollbar-w-1.5 md:scrollbar-w-2
          scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 backdrop-blur-sm mr-4 ${
                  message.type === 'user'
                    ? 'bg-sky-600/90 text-white border border-sky-500/50'
                    : 'bg-[#0f1623]/80 border border-sky-900/50'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane size={16} className="text-sky-400" />
                    <span className="font-semibold text-sky-400">A320 Technical Assistant</span>
                  </div>
                )}
                <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2 backdrop-blur-sm bg-[#0f1623]/80 p-4 rounded-lg border border-sky-900/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about A320 systems, procedures, or specifications..."
            className="flex-1 bg-sky-950/50 border border-sky-800/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-white placeholder-sky-400/50"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium"
          >
            <Send size={18} />
            <span className="hidden md:inline">Send</span>
          </button>
        </form>
      </main>

      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[1] opacity-5 bg-blend-overlay"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}

export default App;