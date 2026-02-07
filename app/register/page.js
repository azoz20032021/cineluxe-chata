'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/chat');
    } catch (err) {
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl mt-14 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter mb-2">CREATE <span className="text-blue-500">ACCOUNT</span></h1>
            <p className="text-gray-400 text-sm">Join the elite network of developers</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-500 ml-1 mb-2 block">Full Name</label>
              <input 
                type="text" 
                placeholder="Jon Alagele" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-700"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-500 ml-1 mb-2 block">Email Address</label>
              <input 
                type="email" 
                placeholder="dev@example.com" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-700"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[2px] font-bold text-gray-500 ml-1 mb-2 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-gray-700"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              INITIALIZE ACCOUNT
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Already a member?{' '}
            <Link href="/login" className="text-white font-bold hover:text-blue-400 transition">
              Sign In
            </Link>
          </p>
        </div>
        
        {/* Footer Link */}
        <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] uppercase tracking-[3px] text-gray-600 hover:text-gray-400 transition">
              ← Back to Terminal
            </Link>
        </div>
      </div>
    </div>
  );
}