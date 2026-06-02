import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../services/api';
import AuthService from '../services/AuthService';

const parseMarkdown = (text) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
        const isBullet = /^\s*[\-\*]\s+(.*)/.exec(line);
        const isNumbered = /^\s*(\d+)\.\s+(.*)/.exec(line);
        const isHeader3 = /^\s*###\s+(.*)/.exec(line);
        const isHeader2 = /^\s*##\s+(.*)/.exec(line);
        const isHeader1 = /^\s*#\s+(.*)/.exec(line);
        
        let content = line;
        let isListItem = false;
        let listStyle = '';
        let isHeader = false;
        let headerLevel = 0;
        
        if (isBullet) {
            content = isBullet[1];
            isListItem = true;
            listStyle = 'bullet';
        } else if (isNumbered) {
            content = isNumbered[2];
            isListItem = true;
            listStyle = 'numbered';
        } else if (isHeader3) {
            content = isHeader3[1];
            isHeader = true;
            headerLevel = 3;
        } else if (isHeader2) {
            content = isHeader2[1];
            isHeader = true;
            headerLevel = 2;
        } else if (isHeader1) {
            content = isHeader1[1];
            isHeader = true;
            headerLevel = 1;
        }
        
        const boldParts = content.split('**');
        const renderedContent = boldParts.map((part, idx) => {
            if (idx % 2 === 1) {
                return <strong key={idx} className="font-extrabold text-slate-900">{part}</strong>;
            }
            return part;
        });
        
        if (isListItem) {
            if (listStyle === 'bullet') {
                return (
                    <li key={index} className="ml-5 list-disc my-1 text-slate-700 leading-relaxed pl-1">
                        {renderedContent}
                    </li>
                );
            } else {
                return (
                    <li key={index} className="ml-5 list-decimal my-1 text-slate-700 leading-relaxed pl-1" style={{ listStyleType: 'decimal' }}>
                        {renderedContent}
                    </li>
                );
            }
        }
        
        if (isHeader) {
            if (headerLevel === 3) {
                return <h4 key={index} className="text-xs font-black text-slate-900 mt-2.5 mb-1">{renderedContent}</h4>;
            } else if (headerLevel === 2) {
                return <h3 key={index} className="text-sm font-black text-slate-900 mt-3.5 mb-1.5">{renderedContent}</h3>;
            } else {
                return <h2 key={index} className="text-base font-black text-slate-900 mt-4 mb-2">{renderedContent}</h2>;
            }
        }
        
        return (
            <p key={index} className="my-1 min-h-[1rem] text-slate-700 leading-relaxed">
                {renderedContent}
            </p>
        );
    });
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am the EdVoyage AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);
    const user = AuthService.getCurrentUser();

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await api.post('/chat', {
                message: userMessage,
                userId: user?.id || 'guest',
                email: user?.email || 'guest@edvoyage.com',
                name: user?.fullName || 'Guest User',
                gpa: user?.gpa || null,
                major: user?.major || null,
                degree: user?.degree || null,
                budget: user?.budget || null,
                targetCountries: user?.targetCountries || null
            });

            // Extract response text robustly from n8n JSON output
            const botResponse = data.output || data.response || data.text || data.message || (Array.isArray(data) ? (data[0]?.output || data[0]?.response || data[0]?.text) : null) || JSON.stringify(data) || "I'm sorry, I couldn't process your request.";
            
            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I am having trouble connecting to my brain right now. Please try again later.' }]);
        } finally {
            setIsTyping(false);
        }
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
                                    {msg.type === 'user' ? msg.text : parseMarkdown(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white border border-slate-200 text-slate-500 rounded-xl sm:rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-slate-100 p-3 sm:p-4 shrink-0">
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
