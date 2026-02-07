'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 text-center max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            TALK CODE <br />
            <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
              SHARE LOGIC
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
            The next-gen real-time communication hub for developers 
            Built with <span className="text-blue-400">Next.js </span> and <span className="text-yellow-400">Firebase</span> for lightning-fast interactions
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href={user ? "/chat" : "/login"} className="group relative px-8 py-4 bg-white text-black font-black rounded-sm overflow-hidden transition-all hover:pr-12">
              <span className="relative z-10">{user ? "LAUNCH CHAT" : "GET ACCESS"}</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
            </Link>
            
            <Link href="https://github.com/azoz20032021" target="_blank" className="px-8 py-4 border border-white/10 hover:border-white/30 rounded-sm font-bold transition">
              VIEW SOURCE
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="mt-24 w-full max-w-6xl aspect-video rounded-t-3xl border-t border-x border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2">
           <div className="w-full h-full bg-[#0a0a0a] rounded-t-2xl flex items-center justify-center border border-white/5">
              <p className="text-white/20 font-mono text-sm">Waiting for live data sync...</p>
           </div>
        </div>
      </section>

      {/* Tech Stack section */}
      <section id="tech" className="py-20 border-t border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">NEXT.js</span>
              <p className="text-[10px] text-blue-500 uppercase tracking-widest mt-1">Framework</p>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">FIREBASE</span>
              <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Backend</p>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">TAILWIND</span>
              <p className="text-[10px] text-cyan-500 uppercase tracking-widest mt-1">Design</p>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">VERCEL</span>
              <p className="text-[10px] text-white uppercase tracking-widest mt-1">Cloud</p>
           </div>
        </div>
      </section>
    </div>
  );
}