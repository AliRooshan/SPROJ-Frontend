import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am the EdVoyage AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages([...messages, { type: 'user', text: userMessage }]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            let botResponse = "I'm a prototype AI. I can't answer that yet, but I'm learning!";

            if (userMessage.toLowerCase().includes('apply')) {
                botResponse = "To apply, navigate to the 'Explore' page, select a program you like, and click the 'Apply Now' button. Make sure your profile is 100% complete first!";
            } else if (userMessage.toLowerCase().includes('scholarship')) {
                botResponse = "We have many scholarships available! Check the 'Scholarships' tab in your dashboard to match with ones that fit your profile.";
            }

            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[60] bg-white sm:w-96 sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:rounded-2xl shadow-2xl flex flex-col sm:border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-primary p-3 sm:p-4 flex justify-between items-center text-white shadow-sm shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse ring-2 ring-white/20 shrink-0"></div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg leading-tight">AI Assistant</h3>
                                <p className="text-[10px] sm:text-xs text-blue-100 opacity-90">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-slate-50 space-y-3 sm:space-y-4 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-primary text-white rounded-br-sm'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Suggested Questions & Input */}
                    <div className="bg-white border-t border-slate-100 p-3 sm:p-4 shrink-0 space-y-2 sm:space-y-3">
                        {/* Suggested Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {[
                                { label: "How do I apply?", val: "How do I apply?" },
                                { label: "Scholarships", val: "scholarship info" },
                                { label: "Deadlines", val: "application deadlines" }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(item.val)}
                                    className="text-[10px] sm:text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors whitespace-nowrap"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Float Button - Hidden on mobile when open to avoid clutter, visible otherwise */}
            {(!isOpen) && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                    <button
                        onClick={toggleChat}
                        className="bg-primary hover:bg-primary-dark text-white p-3 sm:p-4 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                        aria-label="Open chat"
                    >
                        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
                        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Chat with us
                        </span>
                    </button>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
