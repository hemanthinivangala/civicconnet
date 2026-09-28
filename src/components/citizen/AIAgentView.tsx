import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import {
  askCivicAssist,
  sendKnowledgeToN8n,
  N8N_WEBHOOK_CHAT_URL,
} from '../../services/aiClassifier';
import {
  Bot,
  Zap,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AIAgentViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'gemini' | 'local';
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({ onNavigate }) => {
  const { services, wards, offices, garbageSchedules } = useCivic();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'agent-1',
      sender: 'assistant',
      text: `👋 Welcome! This console is directly connected to your **n8n AI Agent Workflow**:
\`${N8N_WEBHOOK_CHAT_URL}\`

You can test conversational flows, query municipal regulations, or trigger a full synchronization of the city knowledge base into your workflow.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'n8n',
    },
  ]);

  const handleTestConnection = async () => {
    setPingStatus('testing');
    const start = Date.now();
    try {
      const res = await fetch(N8N_WEBHOOK_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ping',
          message: 'Hello from CivicConnect',
          chatInput: 'Hello from CivicConnect',
          timestamp: new Date().toISOString(),
        }),
      });

      const latency = Date.now() - start;
      setPingLatency(latency);

      if (res.ok) {
        setPingStatus('connected');
      } else {
        setPingStatus('error');
      }
    } catch (e) {
      setPingStatus('error');
    }
  };

  const handleSyncKnowledge = async () => {
    setIsSyncing(true);
    setSyncStatus('Transmitting municipal dataset to n8n...');
    const result = await sendKnowledgeToN8n({
      services,
      wards,
      offices,
      schedules: garbageSchedules,
    });
    setIsSyncing(false);
    setSyncStatus(result.message);
    setTimeout(() => setSyncStatus(null), 5000);
  };

  const handleSendMessage = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askCivicAssist(query, {
        services,
        wards,
        offices,
        schedules: garbageSchedules,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source || 'n8n',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Error communicating with the agent. Please verify your n8n workflow is active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            Live n8n Cloud Workflow Agent
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
            n8n AI Municipal Agent Console
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Connected to your custom n8n cloud webhook. Test prompts, verify real-time webhook responses, and push the platform's knowledge base.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={handleTestConnection}
            disabled={pingStatus === 'testing'}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>
              {pingStatus === 'testing'
                ? 'Pinging Webhook...'
                : pingStatus === 'connected'
                ? `Connected (${pingLatency}ms) ✓`
                : pingStatus === 'error'
                ? 'Check Workflow ⚠️'
                : 'Test Connection'}
            </span>
          </button>

          <button
            onClick={handleSyncKnowledge}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSyncing ? 'Syncing...' : 'Sync Website Data to n8n'}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Webhook Endpoint Info Bar */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-slate-500 font-sans uppercase text-[10px] tracking-wider shrink-0">
            Active Endpoint:
          </span>
          <span className="truncate text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            {N8N_WEBHOOK_CHAT_URL}
          </span>
        </div>
        <a
          href="https://hemanthinivangala.app.n8n.cloud"
          target="_blank"
          rel="noreferrer"
          className="text-purple-700 font-sans font-bold flex items-center gap-1 hover:underline shrink-0"
        >
          <span>Open n8n Workspace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Chat Console */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>CivicConnect n8n Agent</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] text-slate-500">
                Bidirectional n8n Chat Webhook Mode
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => handleSendMessage('How do I apply for a birth certificate?')}
              className="hidden sm:inline bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
            >
              Birth Certificate
            </button>
            <button
              onClick={() => handleSendMessage('How do I report a pothole on Federal Ave?')}
              className="hidden sm:inline bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
            >
              Report Pothole
            </button>
            <button
              onClick={() => handleSendMessage('When is garbage collected in Ward 2?')}
              className="hidden md:inline bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
            >
              Garbage Route
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line prose-xs">{m.text}</div>
              </div>

              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                {m.source === 'n8n' && (
                  <span className="text-[9px] uppercase font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-purple-600" />
                    n8n Workflow
                  </span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 p-3 rounded-2xl w-fit shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>Streaming response from n8n AI agent...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to your n8n AI agent..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
