'use client';
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/chat');
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/chat');
    } catch (err) {
      setError("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative  overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-2xl mt-14 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter mb-2">WELCOME <span className="text-blue-500">BACK</span></h1>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
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
              AUTHORIZE ACCESS
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#121212] px-4 text-gray-500 font-bold">OR CONTINUIE WITH</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5" />
            Google Sign-In
          </button>

          <p className="mt-8 text-center text-gray-500 text-sm">
            New to the network?{' '}
            <Link href="/register" className="text-white font-bold hover:text-blue-400 transition">
              Create Account
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] uppercase tracking-[3px] text-gray-600 hover:text-gray-400 transition">
              ← Return to Root
            </Link>
        </div>
      </div>
    </div>
  );
}