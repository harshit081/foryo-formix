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

  // Interactive Demo Question state for landing page mini-builder
  const [demoQuestion, setDemoQuestion] = useState({
    title: 'What is Foryo Formix?',
    type: 'MULTIPLE_CHOICE',
    choices: ['Just another form builder', 'A form operations platform', 'A Google Forms clone'],
    points: 10,
    required: true,
    correctIdx: 1
  });

  // Autoplay Simulator states
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [autoplayStep, setAutoplayStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: '80%', y: '320px', visible: true });
  const [autoplayTimeoutId, setAutoplayTimeoutId] = useState<any>(null);

  // Interactive Showcase Theme states
  const [showcaseTheme, setShowcaseTheme] = useState('glass');
  const [showcaseMode, setShowcaseMode] = useState('light');

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

  // Resume autoplay simulator after user inactivity
  const handleUserActivity = () => {
    setIsAutoplayPaused(true);
    setCursorPos(prev => ({ ...prev, visible: false }));
    if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
    
    const tid = setTimeout(() => {
      setIsAutoplayPaused(false);
      setCursorPos(prev => ({ ...prev, visible: true }));
      setAutoplayStep(0); // Reset to step 0
    }, 8500);
    setAutoplayTimeoutId(tid);
  };

  // Autoplay step timer
  useEffect(() => {
    if (token || isSandbox || isAutoplayPaused) return;

    const interval = setInterval(() => {
      setAutoplayStep(prev => (prev + 1) % 9);
    }, 2500);

    return () => clearInterval(interval);
  }, [token, isSandbox, isAutoplayPaused]);

  // Autoplay step action mappings
  useEffect(() => {
    if (token || isSandbox || isAutoplayPaused) return;

    switch (autoplayStep) {
      case 0:
        setCursorPos({ x: '180px', y: '110px', visible: true });
        setDemoQuestion({
          title: '',
          type: 'MULTIPLE_CHOICE',
          choices: ['', '', ''],
          points: 0,
          required: false,
          correctIdx: -1
        });
        break;
      case 1:
        setCursorPos({ x: '180px', y: '110px', visible: true });
        setDemoQuestion(prev => ({ ...prev, title: 'What is Foryo Formix?' }));
        break;
      case 2:
        setCursorPos({ x: '160px', y: '268px', visible: true });
        setDemoQuestion(prev => {
          const choices = [...prev.choices];
          choices[0] = 'Just another form builder';
          return { ...prev, choices };
        });
        break;
      case 3:
        setCursorPos({ x: '160px', y: '314px', visible: true });
        setDemoQuestion(prev => {
          const choices = [...prev.choices];
          choices[1] = 'A form operations platform';
          return { ...prev, choices };
        });
        break;
      case 4:
        setCursorPos({ x: '160px', y: '358px', visible: true });
        setDemoQuestion(prev => {
          const choices = [...prev.choices];
          choices[2] = 'A Google Forms clone';
          return { ...prev, choices };
        });
        break;
      case 5:
        setCursorPos({ x: '40px', y: '314px', visible: true });
        setDemoQuestion(prev => ({ ...prev, correctIdx: 1 }));
        break;
      case 6:
        setCursorPos({ x: '310px', y: '428px', visible: true });
        setDemoQuestion(prev => ({ ...prev, points: 10 }));
        break;
      case 7:
        setCursorPos({ x: '84px', y: '428px', visible: true });
        setDemoQuestion(prev => ({ ...prev, required: true }));
        break;
      case 8:
        setCursorPos({ x: '280px', y: '428px', visible: true });
        break;
      default:
        break;
    }
  }, [autoplayStep, token, isSandbox, isAutoplayPaused]);

  // Floating bubbles in Ticker
  const [bubbles, setBubbles] = useState<any[]>([]);
  useEffect(() => {
    if (!token && !isSandbox) {
      const list = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 30 + 10}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 5 + 5}s`
      }));
      setBubbles(list);
    }
  }, [token, isSandbox]);

  // Three.js Ecosystem Scene Initialization
  useEffect(() => {
    if (!token && !isSandbox) {
      const initThree = () => {
        const THREE = (window as any).THREE;
        if (!THREE) {
          setTimeout(initThree, 100);
          return;
        }
        const container = document.getElementById('threejs-container');
        if (!container) return;
        
        container.innerHTML = '';
        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.z = 4.2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const centralGeo = new THREE.SphereGeometry(0.7, 32, 32);
        const centralMat = new THREE.MeshPhongMaterial({ 
          color: 0x6D5EF9, 
          emissive: 0x18113c,
          shininess: 100 
        });
        const centralNode = new THREE.Mesh(centralGeo, centralMat);
        group.add(centralNode);

        const features = [
          { color: 0xEC4899, distance: 2.1, speed: 0.012, size: 0.2 }, 
          { color: 0xFF6B6B, distance: 2.7, speed: 0.008, size: 0.17 },
          { color: 0x14B8A6, distance: 1.6, speed: 0.018, size: 0.15 },
          { color: 0xA855F7, distance: 3.2, speed: 0.005, size: 0.24 }
        ];

        const nodes: any[] = [];
        features.forEach(f => {
          const geo = new THREE.SphereGeometry(f.size, 24, 24);
          const mat = new THREE.MeshPhongMaterial({ color: f.color, emissive: f.color, emissiveIntensity: 0.4 });
          const mesh = new THREE.Mesh(geo, mat);
          const pivot = new THREE.Object3D();
          pivot.add(mesh);
          mesh.position.x = f.distance;
          group.add(pivot);
          nodes.push({ pivot, speed: f.speed, mesh });
          
          const ringGeo = new THREE.TorusGeometry(f.distance, 0.006, 16, 100);
          const ringMat = new THREE.MeshBasicMaterial({ color: f.color, transparent: true, opacity: 0.1 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        });

        const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
        light1.position.set(5, 5, 5);
        scene.add(light1);
        const light2 = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(light2);

        let animationFrameId: number;
        function animate() {
          animationFrameId = requestAnimationFrame(animate);
          group.rotation.y += 0.002;
          group.rotation.x += 0.001;
          nodes.forEach(n => { n.pivot.rotation.y += n.speed; });
          centralNode.rotation.y += 0.01;
          renderer.render(scene, camera);
        }

        const handleResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        
        window.addEventListener('resize', handleResize);
        animate();

        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', handleResize);
        };
      };

      const cleanUp = initThree();
      return () => {
        if (cleanUp) cleanUp();
      };
    }
  }, [token, isSandbox]);

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
      <div className="min-h-screen flex flex-col relative bg-[#F7F8FA] text-[#111827] font-sans overflow-x-hidden">
        {/* Animated Custom SVG Workflow Connecting Flow Paths */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <svg width="100%" height="100%" className="opacity-30">
            <defs>
              <linearGradient id="flow-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D5EF9" />
                <stop offset="25%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="75%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <path 
              d="M -100 250 C 350 120, 250 550, 850 420 C 1250 320, 950 750, 1650 620" 
              fill="none" 
              stroke="url(#flow-path-grad)" 
              strokeWidth="2.5" 
              strokeDasharray="10 8" 
              className="animate-[dash_50s_linear_infinite]"
            />
            <path 
              d="M 150 850 C 650 620, 450 950, 1050 880 C 1450 820, 1250 1150, 1850 1020" 
              fill="none" 
              stroke="url(#flow-path-grad)" 
              strokeWidth="1.5" 
              strokeDasharray="6 6" 
              className="animate-[dash_35s_linear_infinite]"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Dynamic Light Glowing Ambient Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#6D5EF9]/4 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#EC4899]/3 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#14B8A6]/4 blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
        
        {/* Top Header */}
        <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-30 relative border-b border-zinc-200/50 backdrop-blur-md bg-white/60 sticky top-0">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 shrink-0 select-none">
              <defs>
                <linearGradient id="header-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6D5EF9" />
                  <stop offset="25%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="75%" stopColor="#FF6B6B" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
              <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="url(#header-spark-grad)" />
              <path d="M12 12C12 12 12.25 15.25 15.5 15.5C12.25 15.75 12 19 12 19C12 19 11.75 15.75 8.5 15.5C11.75 15.25 12 12 12 12Z" fill="url(#header-spark-grad)" opacity="0.8" />
              <path d="M18 4C18 4 18.15 5.95 20.1 6.1C18.15 6.25 18 8.2 18 8.2C18 8.2 17.85 6.25 15.9 6.1C17.85 5.95 18 4 18 4Z" fill="url(#header-spark-grad)" opacity="0.9" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[9px] font-bold text-[#A855F7] tracking-wider uppercase font-display select-none">Foryo</span>
              <span className="text-base font-extrabold font-display tracking-tight text-[#111827]">
                Formix
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-500">
            <a href="#editor" className="hover:text-zinc-900 transition-colors">Visual Editor</a>
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#pillars" className="hover:text-zinc-900 transition-colors">Ecosystem Pillars</a>
            <a href="#operations" className="hover:text-zinc-900 transition-colors">Form Operations</a>
            <a href="#showcase" className="hover:text-zinc-900 transition-colors">Layout Engine</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSandbox(true)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer hidden sm:inline-block"
            >
              Quick Demo
            </button>
            <button 
              onClick={handleLogin}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6D5EF9] to-[#EC4899] hover:from-[#A855F7] hover:to-[#FF6B6B] rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-[#6D5EF9]/15 hover:shadow-[#A855F7]/25"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto w-full px-6 pt-12 pb-16 z-10 relative flex flex-col lg:flex-row items-center justify-center gap-14 min-h-[calc(100vh-140px)]">
          {/* Left Hero Pitch */}
          <div className="flex-1 flex flex-col items-start text-left gap-6 lg:max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6D5EF9]/20 bg-[#6D5EF9]/5 text-xs text-[#6D5EF9] font-bold select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D5EF9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D5EF9]"></span>
              </span>
              <span>Foryo Ecosystem First Product</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.08] tracking-tight text-[#111827]">
              Forms that do more than <span className="gradient-text bg-gradient-to-r from-[#6D5EF9] via-[#A855F7] to-[#EC4899] to-[#14B8A6] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_6s_linear_infinite]">collect.</span>
            </h1>
            
            <p className="text-base text-zinc-600 leading-relaxed">
              Create forms, manage responses, track trends, and turn submissions into actions. The command center for high-performing teams. Design quizzes, parse spreadsheets, apply responsive layout design engines, and sync directly with Google Forms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 z-20">
              <button 
                onClick={handleLogin}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6D5EF9] via-[#A855F7] to-[#EC4899] hover:from-[#A855F7] hover:to-[#FF6B6B] text-white text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#6D5EF9]/20 hover:shadow-[#A855F7]/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Connect Google Drive</span>
              </button>
              
              <button 
                onClick={() => setIsSandbox(true)}
                className="px-7 py-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all duration-200"
              >
                <span>Try Sandbox Locally</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
              <span className="flex items-center gap-1.5">✦ Local-First Sandbox</span>
              <span className="text-zinc-200">|</span>
              <span className="flex items-center gap-1.5">✦ Excel Spreadsheet Parser</span>
              <span className="text-zinc-200">|</span>
              <span className="flex items-center gap-1.5">✦ Responsive CSS Themes</span>
            </div>
          </div>

          {/* Right Column: ThreeJS Container */}
          <div className="flex-1 w-full flex items-center justify-center relative mt-8 lg:mt-0 z-20">
            <div className="relative w-full h-[400px] md:h-[450px] flex items-center justify-center">
              <div className="absolute w-[300px] h-[300px] rounded-full bg-[#6D5EF9]/5 blur-3xl pointer-events-none animate-pulse"></div>
              <div id="threejs-container" className="w-full h-full max-w-[450px] max-h-[450px]"></div>
            </div>
          </div>
        </section>

        {/* Live Activity Ticker Section */}
        <div className="bg-white/60 backdrop-blur-sm border-y border-zinc-200/80 py-6 relative overflow-hidden z-20">
          {/* Bubble container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {bubbles.map(b => (
              <div
                key={b.id}
                className="bubble"
                style={{
                  left: b.left,
                  width: b.size,
                  height: b.size,
                  animationDelay: b.delay,
                  '--duration': b.duration
                } as any}
              />
            ))}
          </div>
          <div className="max-w-7xl mx-auto px-6 overflow-hidden flex items-center gap-12 whitespace-nowrap relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Activity:</span>
            </div>
            <div className="flex items-center gap-16 animate-marquee">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#6D5EF9]">48,291</span>
                <span className="text-xs text-zinc-500 font-medium">Forms Completed Today</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#EC4899]">+12.4%</span>
                <span className="text-xs text-zinc-500 font-medium">Response Rate</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#14B8A6]">1,204</span>
                <span className="text-xs text-zinc-500 font-medium">Workflows Triggered</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#6D5EF9]">850ms</span>
                <span className="text-xs text-zinc-500 font-medium">Avg Sync Speed</span>
              </div>
              
              {/* Duplicate for continuity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#6D5EF9]">48,291</span>
                <span className="text-xs text-zinc-500 font-medium">Forms Completed Today</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#EC4899]">+12.4%</span>
                <span className="text-xs text-zinc-500 font-medium">Response Rate</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#14B8A6]">1,204</span>
                <span className="text-xs text-zinc-500 font-medium">Workflows Triggered</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#6D5EF9]">850ms</span>
                <span className="text-xs text-zinc-500 font-medium">Avg Sync Speed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Canvas Editor Section */}
        <section id="editor" className="max-w-7xl mx-auto w-full px-6 py-24 z-10 relative border-t border-zinc-200/50 bg-[#F7F8FA]">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Interactive Canvas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-none font-display">
              Design Forms, See Previews Instantly
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Watch the simulator design a form, or click inside the editor card to take control and customize the fields yourself. Your modifications sync directly to the mobile preview.
            </p>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-center relative max-w-5xl mx-auto">
            {/* Ambient Background Glow behind widget */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6D5EF9]/5 to-[#14B8A6]/5 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>

            {/* Left Column: Mini Editor Card */}
            <div 
              className="flex-1 p-6 rounded-3xl border border-zinc-200 bg-white shadow-xl flex flex-col gap-5 text-left relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-default"
              onClick={handleUserActivity}
            >
              {/* Autoplay simulator cursor pointer (Figma-style) */}
              {cursorPos.visible && (
                <div 
                  className="absolute pointer-events-none z-[99] flex items-center gap-1"
                  style={{ 
                    left: cursorPos.x, 
                    top: cursorPos.y,
                    transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1), top 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <svg className="w-5.5 h-5.5 text-[#6D5EF9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 3v15.2l4.2-4.2 3.1 7.2 2.6-1.1-3.1-7.2 5.5-.2L4.5 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="miter" />
                  </svg>
                  <div className="bg-[#6D5EF9] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md select-none transform translate-y-3 -translate-x-1 uppercase tracking-wider scale-90">
                    Formix Agent
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#A855F7] tracking-wider uppercase">Platform Editor</span>
                  <span className="text-[11px] text-zinc-400 font-medium mt-0.5">Interactive Operations Canvas</span>
                </div>
                {isAutoplayPaused ? (
                  <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                    Interactive Mode
                  </span>
                ) : (
                  <span className="text-[10px] text-[#6D5EF9] font-bold bg-[#6D5EF9]/10 border border-[#6D5EF9]/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF9] animate-ping"></span>
                    Simulating Autoplay
                  </span>
                )}
              </div>

              {/* Title input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Question Title</label>
                <input 
                  type="text" 
                  value={demoQuestion.title}
                  onChange={(e) => setDemoQuestion(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all font-semibold shadow-sm focus:ring-2 focus:ring-[#6D5EF9]/10"
                  placeholder="Type a question..."
                />
              </div>

              {/* Type Select */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Question Type</label>
                <select 
                  value={demoQuestion.type}
                  onChange={(e) => setDemoQuestion(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all cursor-pointer font-semibold shadow-sm"
                >
                  <option value="MULTIPLE_CHOICE" className="bg-white">Multiple Choice</option>
                  <option value="CHECKBOX" className="bg-white">Checkboxes</option>
                  <option value="TEXT" className="bg-white">Short Text</option>
                </select>
              </div>

              {/* Choices builder (only shown for MULTIPLE_CHOICE/CHECKBOX) */}
              {demoQuestion.type !== 'TEXT' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Answer Options & Correct Key</label>
                  <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                    {demoQuestion.choices.map((choice, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <input 
                          type="radio"
                          name="demo-correct"
                          checked={demoQuestion.correctIdx === idx}
                          onChange={() => setDemoQuestion(prev => ({ ...prev, correctIdx: idx }))}
                          className="w-4 h-4 text-[#14B8A6] border-zinc-300 focus:ring-[#14B8A6] cursor-pointer"
                          title="Mark as correct"
                        />
                        <input 
                          type="text"
                          value={choice}
                          onChange={(e) => {
                            const newChoices = [...demoQuestion.choices];
                            newChoices[idx] = e.target.value;
                            setDemoQuestion(prev => ({ ...prev, choices: newChoices }));
                          }}
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all font-medium shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-medium italic mt-0.5">Tip: Click the radio button to designate the correct answer key.</span>
                </div>
              )}

              {/* Points slider & required toggle */}
              <div className="flex items-center justify-between mt-3 pt-4 border-t border-zinc-100 gap-4">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setDemoQuestion(prev => ({ ...prev, required: !prev.required }))}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm ${demoQuestion.required ? 'bg-[#FF6B6B]/15 text-[#dc2626] border border-[#FF6B6B]/30' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-700'}`}
                  >
                    Required Form Field
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Points:</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setDemoQuestion(prev => ({ ...prev, points: Math.max(0, prev.points - 1) }))}
                      className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold flex items-center justify-center cursor-pointer text-zinc-800 border border-zinc-200 shadow-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-zinc-800 min-w-[20px] text-center">{demoQuestion.points}</span>
                    <button 
                      onClick={() => setDemoQuestion(prev => ({ ...prev, points: prev.points + 1 }))}
                      className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold flex items-center justify-center cursor-pointer text-zinc-800 border border-zinc-200 shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Phone View Simulation (Light Gray / Titanium Bezel Mockup) */}
            <div className="w-full md:w-[280px] p-3.5 rounded-[44px] border-[10px] border-zinc-300 bg-zinc-100 shadow-2xl relative flex flex-col justify-between items-stretch mx-auto shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-zinc-300/40">
              {/* Silver Speaker slot / Camera island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-zinc-300 flex items-center justify-center z-20 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
              </div>

              {/* Simulated status bar */}
              <div className="flex justify-between items-center px-4 py-1.5 text-[9px] text-zinc-500 font-bold z-10 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-5 h-2.5 rounded-md border border-zinc-400 bg-zinc-300/50 p-0.5 flex items-center">
                    <div className="w-full h-full bg-zinc-500 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Simulated Mobile screen content */}
              <div className="flex-1 my-3 bg-[#F7F8FA] rounded-[28px] p-4 text-left overflow-y-auto flex flex-col gap-4 max-h-[320px] border border-zinc-200 shadow-inner min-h-[300px]">
                {/* Mobile Header Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#6D5EF9]/10 to-[#EC4899]/10 border-l-3 border-[#6D5EF9] flex flex-col gap-0.5">
                  <span className="text-[8px] font-bold text-[#6D5EF9] uppercase tracking-wider">Foryo Formix Preview</span>
                  <span className="text-[10px] font-black text-zinc-800 leading-tight">Form Operations</span>
                </div>

                {/* Simulated Live Question Panel */}
                <div className="p-3.5 rounded-2xl border border-zinc-200/80 bg-white flex flex-col gap-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-[#EC4899] bg-[#EC4899]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Question
                    </span>
                    {demoQuestion.points > 0 && (
                      <span className="text-[9px] text-[#6D5EF9] font-black bg-[#6D5EF9]/5 px-2 py-0.5 rounded">{demoQuestion.points} Points</span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-zinc-800 font-display leading-tight">
                    {demoQuestion.title || <span className="text-zinc-400 italic font-medium">Untitled Question</span>}
                    {demoQuestion.required && <span className="text-[#FF6B6B] ml-0.5 font-bold">*</span>}
                  </h3>

                  {/* Options Render */}
                  <div className="flex flex-col gap-2 mt-1">
                    {demoQuestion.type === 'TEXT' ? (
                      <div className="w-full h-9 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-[9px] text-zinc-400 flex items-center font-medium">
                        Short text answer key field...
                      </div>
                    ) : (
                      demoQuestion.choices.map((choice, i) => (
                        <div 
                          key={i} 
                          className={`p-2.5 rounded-xl border text-[9px] flex justify-between items-center transition-all duration-300 font-semibold ${demoQuestion.correctIdx === i ? 'border-[#14B8A6]/40 bg-[#14B8A6]/8 text-[#0f766e]' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${demoQuestion.correctIdx === i ? 'border-[#14B8A6] bg-[#14B8A6]' : 'border-zinc-300 bg-white'}`}>
                              {demoQuestion.correctIdx === i && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                            <span>{choice || <span className="opacity-30 italic font-medium">Option {i + 1}</span>}</span>
                          </div>
                          {demoQuestion.correctIdx === i && (
                            <span className="text-[7px] font-black bg-[#14B8A6]/10 px-1.5 py-0.5 rounded text-[#14B8A6] tracking-wider uppercase">KEY</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer simulation */}
                <div className="mt-auto pt-2 flex justify-between items-center border-t border-zinc-150">
                  <span className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Synced with Forms API</span>
                  <div className="w-4.5 h-4.5 rounded-full bg-[#14B8A6] flex items-center justify-center shadow-md animate-pulse" title="Cloud Connection Stable">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Simulated home indicator */}
              <div className="w-24 h-1.5 rounded-full bg-zinc-300 mx-auto mt-1 z-10 select-none"></div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (Command Center Section) */}
        <section id="features" className="py-24 bg-white border-t border-zinc-200/60 z-10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-[#EC4899] uppercase tracking-wider font-display bg-[#EC4899]/5 px-3 py-1.5 rounded-full">Features</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 font-display">The Command Center for your Forms</h2>
              <p className="text-sm text-zinc-500 mt-3 max-w-xl mx-auto">Everything you need to orchestrate data, responses, and teams in a single, fluid interface.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Create */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#6D5EF9]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#6D5EF9]/10 px-2.5 py-1 rounded-full border border-[#6D5EF9]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF9] animate-pulse"></span>
                  <span className="text-[9px] text-[#6D5EF9] font-black uppercase tracking-wider">Demo Animation</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6D5EF9]/10 flex items-center justify-center text-[#6D5EF9] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">add_circle</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 font-display">Create</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Build forms faster with our intuitive drag-and-drop node interface.</p>
                </div>
                <div className="demo-node-builder h-12 flex items-center justify-center gap-4 pt-4 mt-6">
                  <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]"></div>
                  <div className="h-[1.5px] w-8 bg-[#6D5EF9]/30"></div>
                  <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]" style={{ animationDelay: '0.5s' }}></div>
                  <div className="h-[1.5px] w-8 bg-[#6D5EF9]/30"></div>
                  <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Excel to Form */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#A855F7]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#A855F7]/10 px-2.5 py-1 rounded-full border border-[#A855F7]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></span>
                  <span className="text-[9px] text-[#A855F7] font-black uppercase tracking-wider">Active Engine</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">table_view</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 font-display">Excel to Form</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Instantaneously convert complex spreadsheets into smart, interactive forms.</p>
                </div>
                <div className="h-12 flex items-center justify-center pt-4 mt-6">
                  <span className="material-symbols-outlined text-[#A855F7] text-2xl sync-icon animate-pulse">sync</span>
                </div>
              </div>

              {/* Google Forms Sync */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#14B8A6]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#14B8A6]/10 px-2.5 py-1 rounded-full border border-[#14B8A6]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                  <span className="text-[9px] text-[#14B8A6] font-black uppercase tracking-wider">Synced Live</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">sync_alt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 font-display">Google Sync</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Mirror data bi-directionally with Google Forms for legacy compatibility.</p>
                </div>
                <div className="h-12 flex items-center justify-center pt-4 mt-6">
                  <span className="material-symbols-outlined text-[#14B8A6] text-2xl sync-icon">sync</span>
                </div>
              </div>

              {/* Manage */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#EC4899]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#EC4899]/10 px-2.5 py-1 rounded-full border border-[#EC4899]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-pulse"></span>
                  <span className="text-[9px] text-[#EC4899] font-black uppercase tracking-wider">Demo Animation</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">folder_managed</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 font-display">Manage</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Organize responses centrally with high-fidelity status cards.</p>
                </div>
                <div className="demo-cards h-12 flex items-center justify-center gap-3 pt-4 mt-6 overflow-hidden">
                  <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20"></div>
                  <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20" style={{ animationDelay: '0.4s' }}></div>
                  <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20" style={{ animationDelay: '0.8s' }}></div>
                </div>
              </div>

              {/* Analyze */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#FF6B6B]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#FF6B6B]/10 px-2.5 py-1 rounded-full border border-[#FF6B6B]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"></span>
                  <span className="text-[9px] text-[#FF6B6B] font-black uppercase tracking-wider">Demo Animation</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/10 flex items-center justify-center text-[#FF6B6B] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">bar_chart_4_bars</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 font-display">Analyze</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Understand performance with automated trends and insight reports.</p>
                </div>
                <div className="demo-growth h-12 flex flex-col justify-center gap-2.5 pt-4 mt-6">
                  <div className="bar h-2 bg-[#FF6B6B]/40 rounded-full"></div>
                  <div className="bar h-2 bg-[#FF6B6B]/40 rounded-full" style={{ animationDelay: '0.5s', opacity: 0.6 }}></div>
                </div>
              </div>

              {/* Automate */}
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#14B8A6]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#14B8A6]/10 px-2.5 py-1 rounded-full border border-[#14B8A6]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                  <span className="text-[9px] text-[#14B8A6] font-black uppercase tracking-wider">Demo Animation</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] mb-6 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">auto_mode</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 font-display">Automate</h3>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Trigger workflows across your stack based on custom logic.</p>
                </div>
                <div className="demo-automate h-12 flex items-center justify-center gap-4 pt-4 mt-6">
                  <div className="w-10 h-5 bg-slate-200 rounded-full p-0.5 flex items-center">
                    <div className="toggle w-4 h-4 bg-white rounded-full shadow-sm animate-toggleSwitch"></div>
                  </div>
                  <span className="material-symbols-outlined text-[#14B8A6] scale-110">check_circle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Showcase Section */}
        <section className="py-24 bg-[#F7F8FA] overflow-hidden border-t border-zinc-200/50 z-10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-xl mx-auto flex flex-col gap-3">
              <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display bg-[#6D5EF9]/5 px-3 py-1.5 rounded-full self-center">Lifecycle</span>
              <h2 className="text-3xl font-extrabold text-[#111827] mt-1 font-display">Seamless Response Flow</h2>
              <p className="text-xs text-zinc-500">How Formix routes information dynamically across your platforms</p>
            </div>

            <div className="relative max-w-5xl mx-auto px-8 py-4">
              {/* Pulsing Glow Path Line */}
              <div className="absolute top-12 left-0 w-full h-1.5 pointer-events-none opacity-80 hidden md:block">
                <svg height="6" preserveAspectRatio="none" viewBox="0 0 1000 6" width="100%">
                  <path className="glowing-flow-line" d="M0 3H1000" stroke="url(#flowGradient)" strokeLinecap="round" strokeWidth="5"></path>
                  <defs>
                    <linearGradient id="flowGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#6D5EF9"></stop>
                      <stop offset="25%" stopColor="#A855F7"></stop>
                      <stop offset="50%" stopColor="#EC4899"></stop>
                      <stop offset="75%" stopColor="#FF6B6B"></stop>
                      <stop offset="100%" stopColor="#14B8A6"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#6D5EF9] shadow-md group-hover:bg-[#6D5EF9] group-hover:text-white transition-all duration-350 hover:scale-105">
                    <span className="material-symbols-outlined text-2xl font-semibold">description</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Form Created</span>
                </div>
                <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#A855F7] shadow-md group-hover:bg-[#A855F7] group-hover:text-white transition-all duration-350 hover:scale-105">
                    <span className="material-symbols-outlined text-2xl font-semibold">send</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Submission</span>
                </div>
                <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#EC4899] shadow-md group-hover:bg-[#EC4899] group-hover:text-white transition-all duration-350 hover:scale-105">
                    <span className="material-symbols-outlined text-2xl font-semibold">rate_review</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Review</span>
                </div>
                <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#FF6B6B] shadow-md group-hover:bg-[#FF6B6B] group-hover:text-white transition-all duration-350 hover:scale-105">
                    <span className="material-symbols-outlined text-2xl font-semibold">assignment_ind</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Assignment</span>
                </div>
                <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

                {/* Step 5 */}
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#14B8A6] shadow-md group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-350 hover:scale-105">
                    <span className="material-symbols-outlined text-2xl font-semibold">check_circle</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Foryo Spark Logo Ecosystem Vision Pillars */}
        <section id="pillars" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Foryo Ecosystem Vision</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-none font-display">
              Foryo Spark Logo Representation
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Foryo helps people collect, manage, understand, and act on information. The colorful spark logo reflects the four pillars of this connected workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Insight */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#6D5EF9]/40 hover:shadow-xl hover:shadow-[#6D5EF9]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#6D5EF9]/10 flex items-center justify-center text-[#6D5EF9]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] font-display">✦ Insight</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Understand response data dynamically. Formix maps correct answers, grades responses in real-time, and calculates aggregate statistical summaries with bar charts.
              </p>
            </div>

            {/* Pillar 2: Discovery */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#EC4899]/40 hover:shadow-xl hover:shadow-[#EC4899]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] font-display">✦ Discovery</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Uncover form layouts inside sheets. Ingest raw spreadsheets (Excel/CSV) containing question titles, option grids, points, and keys to create forms in a single click.
              </p>
            </div>

            {/* Pillar 3: Completion */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#FF6B6B]/40 hover:shadow-xl hover:shadow-[#FF6B6B]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center text-[#FF6B6B]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] font-display">✦ Completion</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Publish workflows securely. Synchronize local forms with Google Forms API. Instantly build questions, choices, page structures, and quiz configurations on the cloud.
              </p>
            </div>

            {/* Pillar 4: Connected Workflows */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#14B8A6]/40 hover:shadow-xl hover:shadow-[#14B8A6]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111827] font-display">✦ Connected Workflows</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Act on information immediately. Connect Drive OAuth structures, implement dual platform/Drive deletions, and link form submissions to active workspace destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Positioning: Form Operations Platform */}
        <section id="operations" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10 text-left">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-[#EC4899] uppercase tracking-wider font-display">Product Positioning</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight font-display">
                Not a simple form builder. An Operations Platform.
              </h2>
            </div>
            <p className="text-sm text-zinc-500 lg:max-w-md leading-relaxed">
              Formix rejects the limitations of traditional drag-and-drop clones. It is built for teams who manage forms as operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Block: What Foryo Formix IS NOT */}
            <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-md flex flex-col gap-6">
              <div className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest font-display">What Foryo Formix is NOT</div>
              
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">Just Another Form Builder</h4>
                    <p className="text-xs text-zinc-500 mt-1">We don't just dump raw input fields into static templates. We focus on connected workflows, analytics data extraction, and Google drive control.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">Just a Google Forms Clone</h4>
                    <p className="text-xs text-zinc-500 mt-1">We synchronize with the Google API but construct local-first sandboxes, rich layouts, draggable accordion layers, and excel importers before pushing live.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">An AI-First Gimmick</h4>
                    <p className="text-xs text-zinc-500 mt-1">AI shouldn't build broken layouts. We use structured schema rules, robust Postgres syncing, Prisma validation, and strict API exports to assure stability.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Block: What Foryo Formix IS */}
            <div className="p-8 rounded-3xl border border-[#14B8A6]/15 bg-[#14B8A6]/3 shadow-md flex flex-col gap-6 relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#14B8A6]/10 rounded-full blur-2xl"></div>
              
              <div className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest font-display">What Foryo Formix IS</div>
              
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">Spreadsheet Configuration Engine</h4>
                    <p className="text-xs text-zinc-500 mt-1">Upload an Excel or CSV file. Automatically isolate questions, options, point allocations, and answer keys, rendering a clean platform edit preview immediately.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">Granular Quiz Operations Controller</h4>
                    <p className="text-xs text-zinc-500 mt-1">Toggle Quiz Mode globally, define points per card, select correct answers, and apply bulk required/optional updates dynamically in a single click.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800">Multi-Theme Adaptation Layouts</h4>
                    <p className="text-xs text-zinc-500 mt-1">Alter components geometry across Glassmorphism, Neo-Brutalism, and Minimalist structures using unified CSS variables rather than hardcoding components.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Layout Showcase Engine */}
        <section id="showcase" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10 text-left">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-14">
            <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Geometry Adaptive Design</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight font-display">
              The Dynamic Theme Adaptor
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Foryo Formix decouples component logic from aesthetics. Toggle the base geometry selectors below to see how borders, shadow offsets, typography, and card panels transform instantly.
            </p>
          </div>

          {/* Interactive Widget Container */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
            
            {/* Control Panel (Left Side of widget) */}
            <div className="flex flex-col gap-5 w-full md:w-[220px] shrink-0 text-left">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Select Style Theme</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'glass', name: 'Glassmorphism' },
                    { id: 'neo-brutalism', name: 'Neo-Brutalism' },
                    { id: 'minimalist', name: 'Minimalist' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setShowcaseTheme(t.id)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-lg border text-left transition-all cursor-pointer ${showcaseTheme === t.id ? 'bg-[#6D5EF9]/10 text-[#6D5EF9] border-[#6D5EF9]/30' : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800'}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-[10px] text-zinc-400 leading-normal bg-zinc-50 p-3 rounded-lg border border-zinc-100 italic font-medium">
                Observe the corner radius, shadow offsets, and outlines as you switch layout styles.
              </div>
            </div>

            {/* Showcase Output Box (Right Side of widget - Always Light Mode) */}
            <div 
              className="flex-1 w-full p-6 rounded-2xl border border-zinc-200 bg-[#F7F8FA] flex flex-col justify-center items-center min-h-[260px] transition-all duration-300"
              style={{
                backgroundColor: showcaseTheme === 'neo-brutalism' ? '#FAFAFA' : '#F7F8FA',
                fontFamily: showcaseTheme === 'neo-brutalism' ? 'Courier New, monospace' : 'Inter, sans-serif'
              }}
            >
              <div 
                className="w-full max-w-[340px] p-5 theme-card text-left transition-all duration-300 bg-white"
                style={{
                  border: showcaseTheme === 'neo-brutalism' ? '3px solid #111827' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: showcaseTheme === 'glass' ? '16px' : (showcaseTheme === 'minimalist' ? '6px' : '0px'),
                  boxShadow: showcaseTheme === 'neo-brutalism' 
                    ? '6px 6px 0px 0px #111827'
                    : (showcaseTheme === 'glass' ? '0 8px 30px rgba(0,0,0,0.04)' : '0 1px 3px rgba(0,0,0,0.05)'),
                  backdropFilter: showcaseTheme === 'glass' ? 'blur(12px)' : 'none',
                  color: '#111827'
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span 
                    className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5"
                    style={{
                      backgroundColor: showcaseTheme === 'neo-brutalism' ? 'transparent' : 'rgba(109, 94, 249, 0.08)',
                      color: '#6D5EF9',
                      border: showcaseTheme === 'neo-brutalism' ? '1.5px solid #111827' : 'none',
                      borderRadius: showcaseTheme === 'glass' ? '6px' : (showcaseTheme === 'minimalist' ? '2px' : '0px')
                    }}
                  >
                    Layout Element
                  </span>
                  <span className="text-[10px] opacity-40 font-bold">Section 2</span>
                </div>

                <h4 className="text-xs font-bold leading-tight mb-2">
                  Adaptable components change shapes, shadows and borders
                </h4>
                
                <p className="text-[10px] opacity-60 leading-normal mb-4 font-semibold">
                  Using responsive CSS custom properties mapped to design-system layouts.
                </p>

                <button 
                  className="w-full py-2 text-xs font-bold transition-all text-center"
                  style={{
                    backgroundColor: '#6D5EF9',
                    color: '#ffffff',
                    border: showcaseTheme === 'neo-brutalism' ? '2px solid #111827' : 'none',
                    borderRadius: showcaseTheme === 'glass' ? '10px' : (showcaseTheme === 'minimalist' ? '4px' : '0px'),
                    boxShadow: showcaseTheme === 'neo-brutalism' 
                      ? '3px 3px 0px 0px #111827'
                      : 'none'
                  }}
                >
                  Confirm Style Update
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white border-t border-zinc-200/60 z-10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between">
                <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"Foryo Formix completely changed how we handle customer feedback. It's no longer just data in a table, but a living workflow."</p>
                <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
                  <img alt="Sarah Chen" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL9AW9GWf-jNf2rIAvdnlytH2KDFncLMCwrj0ypC6cK8h8J9Wbjbb-UxihvEkoSTNxLsVju1XGz8VURo8PHF99FUHVtEwML6RKEyRsZGEQm0oq_tRAiQQopMRgtx4PVse0fqJs7tZHhauh8yIM_kscPXdKuVIp5Odc_JQR8sFB9Ul1nOo2ul27AMINPPl6kdzCu1W0lr1XGEqFcFA7JT8groM3NhZLdb1M6JYxW48C9lE9cnd6dY5o0jwSHiZ0D8yE0Tqp7O-4IAE"/>
                  <div>
                    <p className="text-xs font-extrabold text-[#111827] font-display">Sarah Chen</p>
                    <p className="text-[10px] text-zinc-400 font-bold">Product Lead, TechFlow</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between md:translate-y-4">
                <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"The analytics are breathtaking. We finally understand the 'why' behind our completion rates. The interface is just a joy to use."</p>
                <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
                  <img alt="David Marcus" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnjLGgIKRhfk451Tuz4061d1YObw-4W8dGm0U4ZAJCK_OXHy7pQwT4n655ZVcv3yjCkBZlu8EIzK4JLrRFMQXksIcp-Zk9GL9IrbsuNzDqT5VREtzMfMQiT5nj8qGQKdapSENrnY-FTrNCZYbsZKHYsHkjV00C5IEEyrHFL3vA9NxEx9G4TVZ0_T6T3_btIGZBHX4AEtSNk83DXBdQQFX4WCx4tp7mevDkQC4VBobIu3vaim6pS88VRiC-MzcrZim8bOntD6rYme4"/>
                  <div>
                    <p className="text-xs font-extrabold text-[#111827] font-display">David Marcus</p>
                    <p className="text-[10px] text-zinc-400 font-bold">CTO, Nexus Corp</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 shadow-md text-left flex flex-col justify-between">
                <p className="text-xs text-zinc-600 font-medium italic mb-6 leading-relaxed">"Automations that actually work. We've cut response processing time by 60% using the node-based workflow builder."</p>
                <div className="flex items-center gap-4 border-t border-zinc-200/50 pt-4">
                  <img alt="Alex Rivera" className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB-rSmkukaZ-hHHEqj0qP8Vke1AAp5bYmtoQeHt4Fq-KyGwg3TinJls6HYtUzXE6Yxtkcm3LElqL1a0qyWeUCcEA-nDZMhRWkRWqtD4neQm3M1uLqAz7NJ1nB0AeiaZ4Qyoi5MnQgcGmT-u1fTxFdMVDT4H6SciAhoPO2HuOde3L5lMCyfJE6zC_ZOqlU8q05jBCt538qgq9yEiRDz-al1zYeNBzzdogeqpg0QQ9AQ72Tozj6Yc6UOgQKTLBjkxNwLka7oIrLBkKU"/>
                  <div>
                    <p className="text-xs font-extrabold text-[#111827] font-display">Alex Rivera</p>
                    <p className="text-[10px] text-zinc-400 font-bold">Operations Director, Swiftly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-white border-t border-zinc-200/60 z-10 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-brand-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10 font-display tracking-tight leading-tight">
                Ready to flow your insights into action?
              </h2>
              <p className="text-sm md:text-base mb-10 max-w-xl mx-auto opacity-90 relative z-10 leading-relaxed font-semibold">
                Join 10,000+ teams building the future of data collection and workflow automation with Foryo Formix.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 max-w-md mx-auto">
                <button 
                  onClick={handleLogin}
                  className="h-14 px-8 bg-white text-[#6D5EF9] hover:text-[#A855F7] rounded-2xl font-extrabold text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 cursor-pointer"
                >
                  Get Started for Free
                </button>
                <button 
                  onClick={() => setIsSandbox(true)}
                  className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl font-extrabold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Try Sandbox Simulator
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 z-10 relative border-t border-zinc-200/50 bg-white text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
              <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="#6D5EF9" />
            </svg>
            <span>&copy; {new Date().getFullYear()} Foryo Formix. Flowing insights into action.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-[#111827] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">Status</span>
            <span className="hover:text-[#111827] cursor-pointer transition-colors">Security</span>
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
