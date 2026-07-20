import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/profileStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AppRoutes } from './routes/AppRoutes';

import { useScrollToHash } from './hooks/useScrollToHash';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  // Smooth scroll scroll-to-hash trigger
  useScrollToHash();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile(user.uid);
    }
  }, [user?.uid, fetchProfile]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}


export default App;
