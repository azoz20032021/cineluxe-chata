'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-black tracking-tighter text-white">
          CINE<span className="text-blue-500 underline decoration-blue-500/50 underline-offset-4">LUXE</span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/network" className="hover:text-blue-400 transition">Network</Link>
          <Link href="/chat" className="hover:text-blue-400 transition">Community</Link>
          <Link href="/leaderboard" className="hover:text-blue-400 transition">Leaderboard</Link>
        </div>

        <div className="flex items-center gap-4">
          
          {user ? (
  <div className="flex items-center gap-3">
    {/* جعل الصورة والاسم رابطاً لصفحة البروفايل */}
    <Link href="/profile" className="flex items-center gap-3 group">
      <img 
        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
        className="w-8 h-8 rounded-full border border-blue-500/50 group-hover:border-blue-400 transition" 
        alt="pfp" 
      />
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition hidden sm:block">
        {user.displayName}
      </span>
    </Link>
  
  </div>
) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-full transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              JOIN NOW
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}