'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function NetworkPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. جلب كل المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("lastSeen", "desc")); // ترتيب حسب آخر ظهور (اختياري)
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
           id: doc.id, 
           ...doc.data() 
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 2. فلترة البحث (بالاسم أو المهارات)
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-10 px-6">
      
      {/* Header & Search */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-4">GLOBAL <span className="text-blue-500">NETWORK</span></h1>
        <p className="text-gray-400 mb-8 font-mono text-sm">Discover elite developers and expand your connection</p>
        
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
          <input 
            type="text" 
            placeholder="Search by name or tech stack (e.g. React)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full bg-[#0a0a0a] border border-white/10 p-4 rounded-xl focus:outline-none text-white placeholder:text-gray-600 font-mono text-sm"
          />
          <svg className="absolute right-4 top-4 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex justify-center pt-20"><div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div></div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                
                {/* Decoration Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                     <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      className="w-12 h-12 rounded-full border border-white/10" 
                      alt={user.displayName} 
                    />
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{user.displayName}</h3>
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Developer</p>
                    </div>
                  </div>
                  {/* Active Indicator (Mock) */}
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                </div>

                {/* Bio Section */}
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                  {user.bio || "No bio available yet. Currently exploring the network."}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.skills ? (
                    user.skills.split(',').slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded font-bold uppercase tracking-wider border border-blue-500/20">
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-600 italic">No skills listed</span>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full py-3 bg-white text-black font-black text-xs rounded-lg uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors">
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 font-mono">
              Running search query... 0 results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}