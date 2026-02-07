'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  

  // 1. جلب بيانات المستخدم الحالية
  useEffect(() => {
    if (!loading && !user) router.push('/login');
    
    const fetchData = async () => {
      if (user) {
        setName(user.displayName || '');
        // جلب البيانات الإضافية من Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBio(data.bio || '');
          setSkills(data.skills || '');
        }
      }
    };
    fetchData();
  }, [user, loading, router]);

  // 2. حفظ التعديلات
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      // تحديث الاسم في Authentication
      if (user.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // تحديث البيانات في Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: name,
        bio: bio,
        skills: skills,
        lastUpdated: new Date()
      });

      setMessage('Profile System Updated Successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error: Update Failed.');
    }
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mono">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Operator <span className="text-blue-500">Settings</span></h1>
          <p className="text-gray-500 text-sm font-mono">Configure your public identity node.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${name}`} 
                className="relative w-24 h-24 rounded-full border-2 border-white/10 object-cover"
                alt="Profile"
              />
            </div>
            <p className="mt-4 text-xs text-gray-500 font-mono tracking-widest">{user?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400 ml-1">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500/50 transition-all text-white font-medium"
                placeholder="Enter your codename"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400 ml-1">Bio / Status</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500/50 transition-all text-white h-24 resize-none"
                placeholder="Brief description about yourself..."
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400 ml-1">Tech Stack (Comma Separated)</label>
              <input 
                type="text" 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500/50 transition-all text-white font-mono text-sm"
                placeholder="e.g. React, Firebase, Next.js"
              />
            </div>

            {/* Notification Message */}
            {message && (
              <div className={`text-center text-xs font-bold py-2 rounded ${message.includes('Error') ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'}`}>
                {message}
              </div>
            )}

            {/* Save Button */}
            <button 
              type="button" // غيرت النوع مؤقتاً لتتأكد من الربط، لكن يجب أن يكون submit
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>SAVING...</span>
                </>
              ) : (
                'SAVE CHANGES'
              )}
            </button>
            <div className="pt-6 border-t border-white/5"></div>

            {/* زر تسجيل الخروج بتصميم "Danger" */}
            <button 
              type="button"
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="group w-full relative overflow-hidden border border-red-500/30 hover:border-red-500/80 text-red-500 font-bold py-4 rounded-xl transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-xs tracking-[2px] uppercase">SIGN OUT</span>
              </div>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}