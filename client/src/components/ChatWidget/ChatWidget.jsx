import { useState, useRef, useEffect } from 'react';
import { chatbotApi } from '../../services/api';
import { CLINIC } from '../../data/clinicData';

function getOrCreateSessionId() {
  const key = 'sewa_chat_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

const GREETING = `Hi! I'm the ${CLINIC.name} assistant. How can I help you today? 😊`;

function BotAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
      S
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2 ${isBot ? 'items-end' : 'items-end justify-end'}`}>
      {isBot && <BotAvatar />}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
            : 'bg-primary-600 text-white rounded-br-sm'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-end">
      <BotAvatar />
      <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function ActionBanner({ action }) {
  if (!action) return null;
  const config = {
    appointment_booked: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: '✅', text: 'Appointment booked! Check your email for confirmation.' },
    lead_saved: { bg: 'bg-primary-50 border-primary-200 text-primary-800', icon: '👋', text: "We've saved your info. We'll be in touch soon!" },
    human_handoff: { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: '📞', text: 'A team member will contact you shortly.' },
  };
  const c = config[action];
  if (!c) return null;
  return (
    <div className={`mx-3 mb-2 px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 ${c.bg}`}>
      <span>{c.icon}</span>
      <span>{c.text}</span>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = useRef(getOrCreateSessionId());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLastAction(null);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await chatbotApi.sendMessage(sessionId.current, text);
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        if (!open) setUnread(n => n + 1);
      }
      if (data.action) setLastAction(data.action);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again or call us at ' + CLINIC.phone }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-teal-600 shadow-lg hover:shadow-xl text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-gray-50"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-teal-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">{CLINIC.nameShort}</p>
              <p className="text-white/70 text-xs mt-0.5">AI Assistant · Usually replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Action banner */}
          <ActionBanner action={lastAction} />

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-3 py-3 flex gap-2 flex-shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              rows={1}
              disabled={loading}
              className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:opacity-50 max-h-24 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 mt-0.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center flex-shrink-0 transition-colors"
              aria-label="Send message"
            >
              <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
