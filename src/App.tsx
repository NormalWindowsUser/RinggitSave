import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { LandingPage } from "./components/LandingPage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ReportPrice } from "./pages/ReportPrice";
import { Account } from './pages/Account';
import { AdminDashboard } from './pages/Admin';
import { MyActivity } from './components/MyActivity';
import { useState, useEffect } from "react";
import { NavItem } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState<NavItem>('home');

  // 1. Initialize state from localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Fallback to system preference if no saved setting exists
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 2. Watch for changes and update the <html> class and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      {/* Pass the toggle function to components that need it (like Header) 
          via props or context. For now, let's assume Header handles the switch.
      */}
      <div className="min-h-screen bg-gray-50 dark:bg-[#1e293b] flex flex-col transition-colors duration-300">
        <Header isDark={isDark} setIsDark={setIsDark} />

        <main className="flex-grow pb-24"> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/report" element={<ReportPrice />} /> 
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-activity" element={<MyActivity />} />
          </Routes>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </BrowserRouter>
  );
}

export default App;