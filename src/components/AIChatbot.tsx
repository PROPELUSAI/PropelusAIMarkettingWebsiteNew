/**
 * AIChatbot.tsx — Floating AI chatbot widget (client component).
 * Features: lead capture form (name + email) before chat is unlocked,
 * newsletter auto-subscription, session persistence via sessionStorage,
 * Gemini AI responses via backend, clear/reset functionality.
 * Appears as a floating button in the bottom-right corner.
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendChatMessageMutation, useChatbotSubscribeNewsletterMutation, ChatMessage } from '@/store';

const CHAT_SESSION_KEY = 'propelusai_chat_session';
const CHAT_MESSAGES_KEY = 'propelusai_chat_messages';
const CHAT_USER_KEY = 'propelusai_chat_user';

/** Generates a unique session ID for chat tracking */
const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/** Retrieves or creates a session ID from sessionStorage */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem(CHAT_SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(CHAT_SESSION_KEY, sessionId);
  }
  return sessionId;
};

/** Loads chat messages from sessionStorage (returns empty array on failure) */
const loadMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = sessionStorage.getItem(CHAT_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/** Persists chat messages to sessionStorage */
const saveMessages = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
};

/** Loads saved user info (name + email) from sessionStorage */
const loadUser = (): { name: string; email: string } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(CHAT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/** Persists user info to sessionStorage */
const saveUser = (user: { name: string; email: string }) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CHAT_USER_KEY, JSON.stringify(user));
};

/** Main chatbot component: floating button, lead capture form, and chat window */
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(getSessionId);
  
  // Lead capture form state
  const [chatUser, setChatUser] = useState<{ name: string; email: string } | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formError, setFormError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation();
  const [subscribeNewsletter, { isLoading: isSubscribing }] = useChatbotSubscribeNewsletterMutation();

  // Load user & messages on mount
  useEffect(() => {
    const storedUser = loadUser();
    if (storedUser) {
      setChatUser(storedUser);
    }
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // Focus input when chat opens and user is verified
  useEffect(() => {
    if (isOpen && chatUser && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, chatUser]);

  // Handle lead capture form submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const name = formName.trim();
    const email = formEmail.trim().toLowerCase();

    if (!name) { setFormError('Please enter your name'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError('Please enter a valid email'); return; }

    try {
      // Subscribe to newsletter and link to chat session
      await subscribeNewsletter({ name, email, source: 'chatbot', sessionId }).unwrap();
    } catch {
      // Even if already subscribed, we still let them chat
    }

    // Save user and unlock chat
    const user = { name, email };
    setChatUser(user);
    saveUser(user);

    // Add a welcome message from the assistant
    const firstName = name.split(' ')[0];
    const welcomeMsg: ChatMessage = {
      role: 'assistant',
      content: `Hey ${firstName}! 👋 Welcome to PropelusAI. I'm Propel, your AI assistant. Ask me anything about our services, products, or how we can help grow your business with AI!`,
    };
    setMessages([welcomeMsg]);
  };

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isSending || !chatUser) return;

    const userMessage = message.trim();
    setMessage('');

    // Add user message
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await sendMessage({
        message: userMessage,
        sessionId,
        userName: chatUser.name.split(' ')[0], // Send first name
        userEmail: chatUser.email, // Send email for conversation tracking
      }).unwrap();

      // Add assistant response
      if (response.success && response.data?.reply) {
        const assistantMessage: ChatMessage = { role: 'assistant', content: response.data.reply };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [message, isSending, sendMessage, sessionId, chatUser]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setChatUser(null);
    setFormName('');
    setFormEmail('');
    sessionStorage.removeItem(CHAT_MESSAGES_KEY);
    sessionStorage.removeItem(CHAT_SESSION_KEY);
    sessionStorage.removeItem(CHAT_USER_KEY);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[9999] w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Propel — PropelusAI</h3>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    {chatUser ? `Chatting with ${chatUser.name.split(' ')[0]}` : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat & reset"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* ─── Lead Capture Form (shown before chat is unlocked) ─── */}
            {!chatUser ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-50">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-brand-600">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-surface-800 mb-1 text-center">Welcome to PropelusAI!</h4>
                <p className="text-sm text-surface-500 text-center mb-6 max-w-[280px]">
                  Enter your details to start chatting with Propel, our AI assistant. You&apos;ll also get subscribed to our newsletter for AI insights!
                </p>

                <form onSubmit={handleLeadSubmit} className="w-full max-w-[300px] space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                      disabled={isSubscribing}
                      autoFocus
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                      disabled={isSubscribing}
                    />
                  </div>
                  {formError && (
                    <p className="text-xs text-red-500 text-center">{formError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full py-2.5 text-sm font-medium bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubscribing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Setting up...
                      </>
                    ) : (
                      <>
                        Start Chatting
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-[0.6rem] text-surface-400 text-center leading-relaxed">
                    By continuing, you agree to receive our newsletter. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            ) : (
              <>
                {/* ─── Messages Area ─── */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-600 text-white rounded-br-md'
                            : 'bg-white text-surface-700 rounded-bl-md shadow-sm border border-surface-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-surface-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ─── Input ─── */}
                <div className="p-4 border-t border-surface-200 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-4 py-2.5 text-sm rounded-full border border-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-[0.65rem] text-surface-400 text-center mt-2">
                    Powered by PropelusAI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
