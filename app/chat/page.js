'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);
  const router = useRouter();

  // 1. حماية الصفحة (التوجيه إذا لم يكن مسجلاً)
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // 2. جلب الرسائل لحظياً
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 3. النزول التلقائي لآخر رسالة
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- دوال جديدة ---

  // دالة إرسال الرسالة
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    setNewMessage('');
  };

  // دالة حذف الرسالة
  const deleteMessage = async (id) => {
    if (confirm("Are you sure you want to delete this messages?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  // دالة تنسيق الوقت (مثلاً: 10:30 PM)
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Sending...';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ------------------

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center text-white font-mono">Loading Interface...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-[#050505] text-white overflow-hidden relative">
      
      {/* 1. Header Area */}
      <div className="z-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between px-6 lg:px-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <h2 className="text-xs font-black uppercase text-gray-200">Global_Terminal</h2>
        </div>
        <div className="text-[10px] text-gray-500 font-mono italic">
          Secure Connection Active
        </div>
      </div>

      {/* 2. Messages Display Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-[#050505]">
        <div className="max-w-4xl mx-auto pb-4">
          {messages.map((msg) => {
            const isMe = msg.uid === user?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-6 group animate-in fade-in duration-300 slide-in-from-bottom-2`}>
                <div className={`flex items-start gap-3 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <img 
                    src={msg.photoURL || `https://ui-avatars.com/api/?name=${msg.displayName}&background=0D8ABC&color=fff`} 
                    className={`w-9 h-9 rounded-full border ${isMe ? 'border-blue-500/50' : 'border-white/10 shadow-lg shadow-black'} object-cover`} 
                    alt="avatar" 
                  />
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Info Row (Name & Time) */}
                    <div className="flex items-center gap-2 mb-1 px-1 opacity-70">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {isMe ? 'You' : msg.displayName}
                      </span>
                      <span className="text-[9px] text-gray-600 font-mono">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {/* Bubble Row + Delete Button */}
                    <div className="relative flex items-center gap-2">
                      
                      {/* Delete Button (Left side if 'Me') */}
                      {isMe && (
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-600 hover:text-red-500 p-1.5 rounded-full hover:bg-white/5"
                          title="Delete Log"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}

                      {/* Message Bubble */}
                      <div className={`px-5 py-3 rounded-2xl transition-all duration-300 ${
                        isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_5px_15px_rgba(37,99,235,0.2)]' 
                        : 'bg-[#121212] border border-white/10 text-gray-200 rounded-tl-none hover:bg-[#1a1a1a] shadow-lg'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed tracking-wide whitespace-pre-wrap">{msg.text}</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* 3. Terminal Style Input */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-[#050505] to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="relative flex items-center group">
            {/* Input Glow Layer */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
            
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Execute command / message..."
              className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-6 py-4 pr-16 outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 font-mono text-sm shadow-inner"
            />
            
            <button 
              type="submit" 
              className="absolute right-3 bg-blue-600 hover:bg-blue-500 p-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-600/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          
          <div className="mt-3 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[9px] text-gray-500 font-mono tracking-[4px] uppercase">CINELUX_Protocol_v3.0 // Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}