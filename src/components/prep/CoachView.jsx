import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, User, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';
import { auth } from '../../firebase/config';
import { useInterviewStore } from '../../store/interviewStore';
import { API_URL } from '../../config/api';

export const CoachView = ({ activeTab = 'overview' }) => {
  const { company, role, experience } = useInterviewStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'coach',
      text: `Hi! I am your AI Interview Coach. I am customized for your ${role} preparation at ${company} (${experience} experience).\n\nAsk me to clear doubts, explain concepts, review code, or generate follow-ups matching the active topic: **${activeTab}**!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const notice = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Coach updated context to focus topic: ${activeTab.toUpperCase()}`
      };
      setMessages(prev => [...prev, notice]);
    }
  }, [activeTab]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      console.log('[CoachView] Sending request to:', `${API_URL}/api/coach`);

      const chatHistory = messages
        .filter(m => m.sender !== 'system')
        .map(m => ({ sender: m.sender, text: m.text }));

      let idToken = '';
      try {
        if (auth) {
          await auth.authStateReady();
        }

        if (auth?.currentUser) {
          idToken = await auth.currentUser.getIdToken();
        }
      } catch (err) {
        console.warn('[CoachView] Could not retrieve Firebase ID token:', err.message);
      }

      const authHeader = idToken ? { 'Authorization': `Bearer ${idToken}` } : {};

      const response = await fetch(`${API_URL}/api/coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({
          message: text.trim(),
          history: chatHistory,
          company,
          role,
          experience,
          activeTab
        })
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          console.error('[CoachView] Server error response:', errData);
          if (errData?.error?.message) {
            errMsg = errData.error.message;
          }
        } catch (parseErr) {
          const textBody = await response.text().catch(() => '');
          console.error('[CoachView] Non-JSON error response:', textBody);
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      console.log('[CoachView] Coach response received, model:', data.model);

      const replyText = data.response || data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

      const coachReply = {
        id: `c-${Date.now()}`,
        sender: 'coach',
        text: replyText
      };

      setMessages(prev => [...prev, coachReply]);
    } catch (err) {
      console.error('[CoachView] Request failed:', err.message, err);
      const errorReply = {
        id: `c-err-${Date.now()}`,
        sender: 'coach',
        text: `Error: ${err.message || 'An unexpected error occurred.'}`
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-200 cursor-pointer ${
          isOpen
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
        title="AI Interview Coach"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5.5 w-5.5 fill-current animate-pulse" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[330px] sm:w-[380px] h-[480px] bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-455 fill-current" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none">Interview Coach</h4>
                <span className="text-[9px] text-slate-400 font-medium block mt-1 leading-none">{company} &bull; {role}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-655"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/20 dark:bg-slate-950/10">
            {messages.map(msg => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center py-1 select-none animate-in fade-in">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isCoach = msg.sender === 'coach';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${isCoach ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`h-6.5 w-6.5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] border ${
                    isCoach
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-205 dark:border-slate-700 text-slate-500'
                      : 'bg-brand-600 border-brand-600 text-white'
                  }`}>
                    {isCoach ? <Sparkles className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  </div>

                  <div className={`p-2.5 px-3 rounded-2xl text-[11px] leading-relaxed whitespace-pre-line shadow-3xs ${
                    isCoach
                      ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-brand-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 max-w-[85%] mr-auto items-center animate-in fade-in">
                <div className="h-6.5 w-6.5 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border text-slate-400 text-xs">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                </div>
                <div className="bg-white dark:bg-slate-900 border p-2.5 rounded-2xl shadow-3xs flex gap-1 items-center">
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1 w-1 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-850 space-y-2.5 bg-white dark:bg-slate-900">
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                onClick={() => handleQuickAction("Explain concepts")}
                className="flex-shrink-0 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-705 text-[9px] font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                Explain concepts
              </button>
              <button
                onClick={() => handleQuickAction("Give interview tips")}
                className="flex-shrink-0 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-705 text-[9px] font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                Interview tips
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                disabled={isTyping}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Ask doubt, request tips, write code..."
                className="flex-grow px-3 py-1.5 text-[11px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="cursor-pointer px-2.5"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
