import React, { useState, useRef, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { askCivicAssist } from '../../services/aiClassifier';
import { Bot, X, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface CivicAssistWidgetProps {
  onNavigate: (view: string, detailId?: string) => void;
  isOpenDirect?: boolean;
  onCloseDirect?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export const CivicAssistWidget: React.FC<CivicAssistWidgetProps> = ({
  onNavigate,
  isOpenDirect,
  onCloseDirect,
}) => {
  const { services, wards, offices, garbageSchedules } = useCivic();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am **CivicAssist**, the official digital municipal guide for CivicConnect.

You can ask me questions about city services, required certificates, reporting road hazards, or garbage collection routes.

*Quick suggestion: Click any prompt below to get started!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: 'How to apply for Birth Certificate?', action: 'query:How can I apply for a birth certificate?' },
        { label: 'How to report a pothole?', action: 'query:How do I report a pothole?' },
        { label: 'When is garbage collected?', action: 'query:When is garbage collected in Ward 1?' },
        { label: 'Where is the Municipal Office?', action: 'query:Where is the municipal office and what are working hours?' },
        { label: 'What documents are required for services?', action: 'query:What documents are required for municipal services?' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with direct open props if supplied
  const activeOpen = isOpenDirect !== undefined ? isOpenDirect : isOpen;
  const handleClose = () => {
    if (onCloseDirect) onCloseDirect();
    else setIsOpen(false);
  };

  useEffect(() => {
    if (activeOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await askCivicAssist(textToSend, {
        services,
        wards,
        offices,
        schedules: garbageSchedules,
      });

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: result.quickActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue retrieving that municipal record. Please verify directly with your local Ward Office.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.startsWith('query:')) {
      const q = action.replace('query:', '');
      handleSendMessage(q);
      return;
    }
    if (action.startsWith('services:')) {
      const id = action.replace('services:', '');
      onNavigate('services', id);
      handleClose();
      return;
    }
    if (action === 'report') {
      onNavigate('report');
      handleClose();
      return;
    }
    if (action === 'track') {
      onNavigate('track');
      handleClose();
      return;
    }
    if (action === 'offices') {
      onNavigate('offices');
      handleClose();
      return;
    }
    if (action === 'garbage') {
      onNavigate('garbage');
      handleClose();
      return;
    }
    if (action === 'services') {
      onNavigate('services');
      handleClose();
      return;
    }
    if (action === 'ward') {
      onNavigate('ward');
      handleClose();
      return;
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-fresh',
        sender: 'assistant',
        text: 'CivicAssist chat restarted. How can I assist you with city services today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'Report a Problem', action: 'report' },
          { label: 'Find a Service', action: 'services' },
          { label: 'Track Complaint', action: 'track' },
          { label: 'Find Office', action: 'offices' },
          { label: 'Garbage Schedule', action: 'garbage' },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (when not using full direct page) */}
      {isOpenDirect === undefined && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white p-3.5 rounded-full shadow-xl flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 group border-2 border-white/40"
          aria-label="Open CivicAssist AI"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="font-semibold text-sm hidden md:inline pr-1">CivicAssist AI</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {activeOpen && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-[420px] max-w-full h-[90vh] sm:h-[600px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 flex items-center justify-between border-b border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/60 border border-blue-400/30 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>CivicAssist</span>
                  <span className="text-[10px] bg-blue-500/40 text-blue-200 uppercase px-1.5 py-0.5 rounded font-mono">
                    AI Municipal
                  </span>
                </div>
                <div className="text-[11px] text-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Grounded in City Knowledge
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart chat"
                className="text-blue-200 hover:text-white p-1.5 rounded-lg transition hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-blue-200 hover:text-white p-1.5 rounded-lg transition hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-700 scrollbar-none">
            <button
              onClick={() => handleActionClick('report')}
              className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 shrink-0"
            >
              ⚠️ Report Problem
            </button>
            <button
              onClick={() => handleActionClick('services')}
              className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 shrink-0"
            >
              📑 Find Service
            </button>
            <button
              onClick={() => handleActionClick('track')}
              className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 shrink-0"
            >
              🔍 Track ID
            </button>
            <button
              onClick={() => handleActionClick('garbage')}
              className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 shrink-0"
            >
              🚛 Garbage
            </button>
            <button
              onClick={() => handleActionClick('offices')}
              className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 shrink-0"
            >
              🏛️ Ward Offices
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose-xs">{m.text}</div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>

                {/* Quick actions chips */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.quickActions.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(qa.action)}
                        className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-medium py-1 px-2.5 shadow-2xs transition active:scale-95 text-left"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl w-fit shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Checking municipal databases...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about birth certificate, potholes, garbage..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between px-1">
              <span>Grounding: Municipal records only</span>
              <span>CivicConnect SafeGuard</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
