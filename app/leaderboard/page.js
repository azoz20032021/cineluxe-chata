'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      // نجلب المستخدمين (لاحقاً يمكن ترتيبهم حسب عدد الرسائل أو النقاط)
      const q = query(collection(db, "users"), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setLeaders(data);
    };
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
            Elite <span className="text-yellow-500">Rankings</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm">Top contributors based on code impact and activity.</p>
        </div>

        {/* The Podium (Top 3) - تصميم المنصة */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16">
          {leaders.slice(0, 3).map((user, index) => {
            // ترتيب المنصة: الثاني - الأول - الثالث
            let orderClass = "order-2"; // افتراضي
            let heightClass = "h-40";
            let colorClass = "bg-gray-700";
            let rank = index + 1;
            
            // تخصيص الألوان والارتفاع
            if (index === 0) { // الأول (Gold)
              orderClass = "order-1 md:order-2"; 
              heightClass = "h-52";
              colorClass = "bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.4)]";
            } else if (index === 1) { // الثاني (Silver)
              orderClass = "order-2 md:order-1";
              heightClass = "h-44";
              colorClass = "bg-gradient-to-t from-gray-500 to-gray-300";
            } else if (index === 2) { // الثالث (Bronze)
              orderClass = "order-3";
              heightClass = "h-36";
              colorClass = "bg-gradient-to-t from-orange-700 to-orange-500";
            }

            return (
              <div key={user.uid} className={`${orderClass} flex flex-col items-center group`}>
                <div className="relative mb-4">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    className={`w-16 h-16 rounded-full border-4 border-[#050505] relative z-10 group-hover:scale-110 transition-transform`}
                  />
                  {index === 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                  )}
                </div>
                
                <div className={`w-32 ${heightClass} ${colorClass} rounded-t-2xl flex flex-col justify-end p-4 text-center relative overflow-hidden`}>
                  <div className="font-black text-black uppercase tracking-wider truncate w-full text-xs mb-1">
                    {user.displayName}
                  </div>
                  <div className="text-black/60 font-mono font-bold text-2xl">
                    #{rank}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The List (Rest of users) - القائمة العادية */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {leaders.slice(3).map((user, index) => (
            <div key={user.uid} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-mono w-8 text-center font-bold">#{index + 4}</span>
                <img src={user.photoURL} className="w-10 h-10 rounded-full bg-gray-800" />
                <span className="font-bold text-gray-200">{user.displayName}</span>
              </div>
              <div className="text-xs font-mono text-green-500 uppercase tracking-widest">
                Active Agent
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}