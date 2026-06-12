'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FormBuilder from '../components/FormBuilder';
import FormManager from '../components/FormManager';
import FormAnalytics from '../components/FormAnalytics';
import Settings from '../components/Settings';
import { ShieldAlert } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('builder');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [clientIdLoaded, setClientIdLoaded] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [theme, setTheme] = useState('glass');
  const [mode, setMode] = useState('dark');
  
  // Custom navigation targets
  const [activeEditForm, setActiveEditForm] = useState<any>(null);
  const [activeAnalyticsFormId, setActiveAnalyticsFormId] = useState<string>('');

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sandbox Mode state
  const [isSandbox, setIsSandbox] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', `${newTheme}-${mode}`);
    const friendlyName = newTheme === 'glass' ? 'Glassmorphism' : newTheme === 'neo-brutalism' ? 'Neo-Brutalism' : 'Minimalist';
    showToast(`Theme style set to ${friendlyName}`, 'info');
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
    document.documentElement.setAttribute('data-theme', `${theme}-${newMode}`);
    showToast(`Color mode set to ${newMode === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
  };

  // Check backend health & fetch configuration
  const checkBackendStatus = async () => {
    try {
      const healthRes = await fetch('http://localhost:5000/health');
      if (healthRes.ok) {
        setBackendHealthy(true);
        
        // Fetch public Client ID config
        const configRes = await fetch('http://localhost:5000/api/auth/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData.clientId) {
            setClientId(configData.clientId);
            setClientIdLoaded(true);
          } else {
            setClientIdLoaded(false);
          }
        }
      } else {
        setBackendHealthy(false);
      }
    } catch (err) {
      setBackendHealthy(false);
      setClientIdLoaded(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();

    // Load theme & mode
    const savedTheme = localStorage.getItem('theme') || 'glass';
    const savedMode = localStorage.getItem('mode') || 'dark';
    setTheme(savedTheme);
    setMode(savedMode);
    document.documentElement.setAttribute('data-theme', `${savedTheme}-${savedMode}`);

    // Check if user has saved login session token
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            localStorage.removeItem('token');
            throw new Error('Session expired');
          }
        })
        .then(userData => {
          setUser(userData);
          setToken(savedToken);
        })
        .catch(() => {
          // Token expired or server offline
        });
    }
  }, []);

  const handleLogin = () => {
    if (!clientIdLoaded) {
      showToast('Google Client ID not loaded. Set it in Setup & Config first.', 'error');
      return;
    }

    try {
      const client = (window as any).google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
        ux_mode: 'popup',
        callback: async (response: any) => {
          if (response.code) {
            try {
              const res = await fetch('http://localhost:5000/api/auth/google-callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: response.code }),
              });

              if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setToken(data.token);
                setIsSandbox(false); // Disable sandbox mode on login
                showToast(`Successfully connected: ${data.user.email}`, 'success');
                setActiveTab('manager');
              } else {
                showToast('OAuth code exchange failed on backend', 'error');
              }
            } catch (err) {
              showToast('Failed to exchange code: server offline', 'error');
            }
          }
        },
      });
      client.requestCode();
    } catch (err) {
      showToast('Google Sign-In script missing or failing. Wait a moment and retry.', 'error');
      console.error('Google accounts script error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
    showToast('Signed out successfully', 'info');
    setActiveTab('builder');
  };

  const handleEditForm = (formObj: any) => {
    setActiveEditForm(formObj);
    setActiveTab('builder');
  };

  const handleImportToBuilder = (importedQuestions: any[], formTitle: string) => {
    setActiveEditForm({
      title: formTitle,
      description: 'Imported from spreadsheet template',
      questions: importedQuestions,
    });
    setActiveTab('builder');
  };

  const handleViewAnalytics = (formId: string) => {
    setActiveAnalyticsFormId(formId);
    setActiveTab('analytics');
  };

  if (!token && !isSandbox) {
    return (
      <div className="min-h-screen flex flex-col justify-between relative bg-[#111827] text-[#f5f5f7] font-sans overflow-hidden">
        {/* Dynamic Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#6D5EF9]/10 blur-[150px] pointer-events-none animate-pulse duration-5000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#14B8A6]/10 blur-[150px] pointer-events-none animate-pulse duration-3000"></div>
        
        {/* Top Header */}
        <header className="max-w-7xl mx-auto w-full px-6 py-8 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 shrink-0 select-none">
              <defs>
                <linearGradient id="landing-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6D5EF9" />
                  <stop offset="25%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="75%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
              <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="url(#landing-spark-grad)" />
              <path d="M12 12C12 12 12.25 15.25 15.5 15.5C12.25 15.75 12 19 12 19C12 19 11.75 15.75 8.5 15.5C11.75 15.25 12 12 12 12Z" fill="url(#landing-spark-grad)" opacity="0.8" />
              <path d="M18 4C18 4 18.15 5.95 20.1 6.1C18.15 6.25 18 8.2 18 8.2C18 8.2 17.85 6.25 15.9 6.1C17.85 5.95 18 4 18 4Z" fill="url(#landing-spark-grad)" opacity="0.9" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[9px] font-bold text-[#A855F7] tracking-wider uppercase font-display select-none">Foryo</span>
              <span className="text-base font-extrabold font-display tracking-tight text-white">
                Formix
              </span>
            </div>
          </div>
          <div>
            <button 
              onClick={handleLogin}
              className="px-4 py-2 text-xs font-semibold text-white border border-white/10 hover:border-white/30 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer animate-fade-in"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 z-10 relative py-12">
          {/* Left Hero Column */}
          <div className="flex-1 flex flex-col items-start text-left gap-6 lg:max-w-xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6D5EF9]/30 bg-[#6D5EF9]/5 text-xs text-[#A855F7] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A855F7]"></span>
              </span>
              <span>Foryo Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.08] tracking-tight text-white">
              Forms that do more than <span className="bg-gradient-to-r from-[#6D5EF9] via-[#EC4899] to-[#14B8A6] bg-clip-text text-transparent">collect responses.</span>
            </h1>
            
            <p className="text-base text-[#8e8e93] leading-relaxed">
              Foryo Formix is a premium <strong>form operations platform</strong>. Built to help you collect, manage, understand, and act on information. Design quizzes, import spreadsheet templates in one click, apply layouts, and sync with live Google Forms.
            </p>

            {/* Spark Logo Values */}
            <div className="grid grid-cols-2 gap-3.5 w-full mt-2">
              <div className="p-3 rounded-xl border border-white/5 bg-white/1 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#6D5EF9] uppercase tracking-wider">✦ Insight</span>
                <span className="text-[11px] text-[#8e8e93] leading-snug">Understand response data dynamically.</span>
              </div>
              <div className="p-3 rounded-xl border border-white/5 bg-white/1 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">✦ Discovery</span>
                <span className="text-[11px] text-[#8e8e93] leading-snug">Uncover spreadsheet configurations.</span>
              </div>
              <div className="p-3 rounded-xl border border-white/5 bg-white/1 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider">✦ Completion</span>
                <span className="text-[11px] text-[#8e8e93] leading-snug">Sync workflows with live Google Forms.</span>
              </div>
              <div className="p-3 rounded-xl border border-white/5 bg-white/1 flex flex-col gap-1 text-left">
                <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">✦ Connected Workflows</span>
                <span className="text-[11px] text-[#8e8e93] leading-snug">Act on information with automation.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <button 
                onClick={handleLogin}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6D5EF9] to-[#EC4899] hover:from-[#A855F7] hover:to-[#FF6B6B] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#6D5EF9]/20 hover:shadow-[#6D5EF9]/35 transition-all duration-300"
              >
                <span>Connect Google Drive</span>
              </button>
              
              <button 
                onClick={() => setIsSandbox(true)}
                className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <span>Sandbox Demo</span>
              </button>
            </div>
          </div>

          {/* Right Visual Parallax Mockup Column */}
          <div className="flex-1 w-full flex justify-center items-center relative lg:h-[450px] mt-10 lg:mt-0 animate-fade-in">
            {/* Background glowing circle behind cards */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#6D5EF9]/20 to-[#EC4899]/20 blur-3xl pointer-events-none"></div>

            {/* Mockup Card 1: Question Builder (Main layer) */}
            <div className="w-[310px] sm:w-[360px] p-6 rounded-2xl border border-white/10 bg-[#1c1c1e]/85 backdrop-blur-xl shadow-2xl relative rotate-[-2deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300 z-20 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#FF6B6B] px-2 py-0.5 bg-[#FF6B6B]/10 rounded-md">Quiz Mode</span>
                  <span className="text-[10px] text-white/40">10 Points</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></div>
              </div>
              
              <div className="flex flex-col gap-1.5 text-left">
                <div className="text-xs text-white/40 font-semibold">Question 1</div>
                <div className="text-sm font-bold text-white font-display">What is the mission of Foryo Ecosystem?</div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-xl border border-[#14B8A6]/30 bg-[#14B8A6]/5 flex justify-between items-center">
                  <span className="text-xs text-[#14B8A6] font-semibold">Act on information</span>
                  <span className="text-[10px] text-[#14B8A6] font-bold px-1.5 py-0.5 bg-[#14B8A6]/10 rounded">Correct Key</span>
                </div>
                <div className="p-3 rounded-xl border border-white/5 bg-white/1 flex items-center">
                  <span className="text-xs text-white/60">Just collect responses</span>
                </div>
              </div>
            </div>

            {/* Mockup Card 2: Layout Style Slider (Floating behind card) */}
            <div className="absolute w-[220px] sm:w-[240px] p-5 rounded-2xl border border-white/10 bg-[#1c1c1e]/75 backdrop-blur-xl shadow-2xl translate-x-[70px] sm:translate-x-[90px] translate-y-[-100px] sm:translate-y-[-110px] rotate-[6deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-300 z-10 flex flex-col gap-3">
              <div className="text-xs font-bold text-white text-left font-display">Layout Styles</div>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-[#6D5EF9]/10 border border-[#6D5EF9]/25">
                  <span className="text-[11px] text-[#A855F7] font-semibold">Glassmorphism</span>
                  <div className="w-2 h-2 rounded-full bg-[#6D5EF9]"></div>
                </div>
                <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/2 border border-white/5">
                  <span className="text-[11px] text-white/50">Neo-Brutalism</span>
                </div>
              </div>
            </div>

            {/* Mockup Card 3: Live Responses Sparklines (Floating bottom-left) */}
            <div className="absolute w-[200px] p-4 rounded-xl border border-white/10 bg-[#1c1c1e]/90 backdrop-blur-xl shadow-2xl translate-x-[-90px] sm:translate-x-[-120px] translate-y-[100px] sm:translate-y-[120px] rotate-[-5deg] hover:rotate-0 hover:scale-[1.03] transition-all duration-300 z-30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#14B8A6]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-white/40 font-semibold leading-none">Total Insights</span>
                <span className="text-base font-bold text-white tracking-tight leading-none mt-1 font-display">1,482</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative border-t border-white/5 text-[11px] text-[#8e8e93]">
          <div>&copy; {new Date().getFullYear()} Foryo Formix. Made for high-performance form operations.</div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative font-sans theme-bg flex-col">
      {/* Toast Notifications container */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[1000]">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`px-5 py-4 rounded shadow-2xl flex items-center gap-3 font-semibold transition-all duration-300 min-w-[300px] border-l-4
              ${t.type === 'success' ? 'bg-[#30d158] border-[#4cd964] text-white' : ''}
              ${t.type === 'error' ? 'bg-[#ff453a] border-[#ff6961] text-white' : ''}
              ${t.type === 'info' ? 'bg-[#5e5ce6] border-[#7876ec] text-white' : ''}
            `}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <Header 
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
        theme={theme}
        onThemeChange={handleThemeChange}
        mode={mode}
        onModeChange={handleModeChange}
      />

      {/* Main panel views */}
      <main className="flex-1 max-w-7xl mx-auto w-full pt-24 pb-28 px-6 sm:px-10 flex flex-col gap-8">
        {!backendHealthy && (
          <div className="px-6 py-4 flex items-center gap-3 rounded-[var(--theme-radius-md)] text-theme-danger border border-theme-danger/20 bg-theme-danger/5 animate-pulse text-sm">
            <ShieldAlert size={18} className="shrink-0" />
            <div>
              <strong>Backend server is offline.</strong> Run <code>npm run dev</code> inside the <code>backend</code> directory to boot the server.
            </div>
          </div>
        )}

        {/* Tab view selectors */}
        {activeTab === 'builder' && (
          <FormBuilder 
            token={token} 
            user={user} 
            showToast={showToast} 
            initialForm={activeEditForm}
            onSaveSuccess={() => {
              setActiveEditForm(null);
              setActiveTab('manager');
            }}
          />
        )}

        {activeTab === 'manager' && (
          <FormManager 
            token={token} 
            showToast={showToast} 
            onEditForm={handleEditForm}
            onViewAnalytics={handleViewAnalytics}
            onImportToBuilder={handleImportToBuilder}
          />
        )}

        {activeTab === 'analytics' && (
          <FormAnalytics 
            token={token} 
            formId={activeAnalyticsFormId}
            onBack={() => setActiveTab('manager')}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            clientIdLoaded={clientIdLoaded}
            backendHealthy={backendHealthy}
            onCheckHealth={checkBackendStatus}
            clientId={clientId}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'builder') {
            setActiveEditForm(null); // Clear editing structure
          }
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
