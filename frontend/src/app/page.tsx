'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FormBuilder from '../components/FormBuilder';
import FormManager from '../components/FormManager';
import FormAnalytics from '../components/FormAnalytics';
import { ShieldAlert } from 'lucide-react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingHero from '../components/landing/LandingHero';
import LandingTicker from '../components/landing/LandingTicker';
import LandingEditor from '../components/landing/LandingEditor';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingWorkflow from '../components/landing/LandingWorkflow';
import LandingPillars from '../components/landing/LandingPillars';
import LandingPositioning from '../components/landing/LandingPositioning';
import LandingThemeShowcase from '../components/landing/LandingThemeShowcase';
import LandingTestimonials from '../components/landing/LandingTestimonials';
import LandingCTA from '../components/landing/LandingCTA';
import LandingFooter from '../components/landing/LandingFooter';
import { checkHealth, getAuthConfig, fetchCurrentUser, exchangeGoogleCode } from '../functions/auth';

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
      const healthRes = await checkHealth();
      if (healthRes.ok) {
        setBackendHealthy(true);
        
        // Fetch public Client ID config
        const configRes = await getAuthConfig();
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
      fetchCurrentUser(savedToken)
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
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.z = 6.8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        // Helper to generate a smooth circular particle texture dynamically
        const createCircleTexture = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;
          
          const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.8)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 16, 16);
          
          return new THREE.CanvasTexture(canvas);
        };
        const circleTexture = createCircleTexture();

        // Starfield Particles (Space Dust)
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 200;
        const starPositions = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i += 3) {
          const r = 3.2 + Math.random() * 3.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2.0 * Math.random() - 1.0);
          
          starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
          starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
          starPositions[i + 2] = r * Math.cos(phi);
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starsMat = new THREE.PointsMaterial({
          color: 0xA855F7,
          size: 0.12, // Increased size to compensate for radial gradient fadeout
          transparent: true,
          opacity: 0.75,
          map: circleTexture || undefined,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });
        const starField = new THREE.Points(starsGeo, starsMat);
        scene.add(starField);

        // Central Core
        const centralGeo = new THREE.SphereGeometry(0.65, 32, 32);
        const centralMat = new THREE.MeshPhongMaterial({ 
          color: 0x6D5EF9, 
          emissive: 0x1c124a,
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
        const orbitRings: any[] = [];
        const energyPackets: any[] = [];

        features.forEach((f, idx) => {
          // Main node sphere
          const geo = new THREE.SphereGeometry(f.size, 24, 24);
          const mat = new THREE.MeshPhongMaterial({ 
            color: f.color, 
            emissive: f.color, 
            emissiveIntensity: 0.5,
            shininess: 80
          });
          const mesh = new THREE.Mesh(geo, mat);
          
          // Pivot group to rotate this node
          const pivot = new THREE.Object3D();
          pivot.add(mesh);
          mesh.position.x = f.distance;
          group.add(pivot);
          
          // Store node data
          nodes.push({ pivot, speed: f.speed, mesh, distance: f.distance, phase: idx * 1.5 });
          
          // Orbit Ring
          const ringGeo = new THREE.TorusGeometry(f.distance, 0.008, 16, 100);
          const ringMat = new THREE.MeshBasicMaterial({ 
            color: f.color, 
            transparent: true, 
            opacity: 0.12 
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
          orbitRings.push({ ring, baseDistance: f.distance, phase: idx * 1.5 });

          // Energy Packet tracing the ring
          const packetGeo = new THREE.SphereGeometry(0.065, 12, 12);
          const packetMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
          });
          const packetMesh = new THREE.Mesh(packetGeo, packetMat);
          group.add(packetMesh);
          energyPackets.push({
            mesh: packetMesh,
            distance: f.distance,
            speed: f.speed * 2.5,
            angle: Math.random() * Math.PI * 2,
            phase: idx * 1.5
          });
        });

        const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
        light1.position.set(5, 5, 5);
        scene.add(light1);
        const light2 = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(light2);

        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;
        const startTime = Date.now();

        const onMouseMove = (event: MouseEvent) => {
          mouseX = (event.clientX / window.innerWidth) - 0.5;
          mouseY = (event.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', onMouseMove);

        function animate() {
          animationFrameId = requestAnimationFrame(animate);
          
          const time = (Date.now() - startTime) * 0.0015;

          // Gentle central core pulse
          const pulse = 1.0 + Math.sin(time * 2) * 0.07;
          centralNode.scale.set(pulse, pulse, pulse);



          // Slowly rotate the stars
          starField.rotation.y -= 0.0005;

          // Parallax Tilt based on Mouse movement
          const targetRotX = mouseY * 0.45;
          const targetRotY = mouseX * 0.45;
          // Add a baseline drift rotation
          const baselineX = Math.sin(time * 0.1) * 0.05;
          const baselineY = time * 0.05;
          group.rotation.x += (targetRotX + baselineX - group.rotation.x) * 0.06;
          group.rotation.y += (targetRotY + baselineY - group.rotation.y) * 0.06;

          // Animate Orbiting Nodes (with organic floating wave)
          nodes.forEach(n => {
            n.pivot.rotation.y += n.speed;
            
            // Float the planet up/down organically using sine waves
            const floatOffset = Math.sin(time + n.phase) * 0.16;
            n.mesh.position.y = floatOffset;
            
            // Make the planet scale pulse slightly matching its float position
            const planetPulse = 1.0 + Math.sin(time * 2 + n.phase) * 0.05;
            n.mesh.scale.set(planetPulse, planetPulse, planetPulse);
          });

          // Animate Orbit Rings to matches the node float slightly (gives elastic wave feel)
          orbitRings.forEach(or => {
            or.ring.position.y = Math.sin(time + or.phase) * 0.08;
          });

          // Animate Energy Packets tracing the orbits
          energyPackets.forEach(p => {
            p.angle += p.speed;
            p.mesh.position.x = Math.cos(p.angle) * p.distance;
            p.mesh.position.z = Math.sin(p.angle) * p.distance;
            // Float energy packets in sync with the nodes
            p.mesh.position.y = Math.sin(time + p.phase) * 0.12;
            
            // Pulse the energy packets brightness/scale
            const packPulse = 0.8 + Math.sin(time * 6 + p.phase) * 0.2;
            p.mesh.scale.set(packPulse, packPulse, packPulse);
          });

          renderer.render(scene, camera);
        }

        const handleResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (w && h) {
            camera.aspect = w / h;
            const fovRad = (camera.fov / 2) * Math.PI / 180;
            const requiredZ = 3.6 / (Math.tan(fovRad) * camera.aspect);
            camera.position.z = Math.max(6.8, requiredZ);
            
            group.position.x = 0;
            group.position.y = 0;

            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        };

        // Use ResizeObserver for responsive resizing
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
              const { width: w, height: h } = entry.contentRect;
              if (w && h) {
                camera.aspect = w / h;
                const fovRad = (camera.fov / 2) * Math.PI / 180;
                const requiredZ = 3.6 / (Math.tan(fovRad) * camera.aspect);
                camera.position.z = Math.max(6.8, requiredZ);
                
                group.position.x = 0;
                group.position.y = 0;

                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
              }
            }
          });
          resizeObserver.observe(container);
        } else {
          window.addEventListener('resize', handleResize);
        }
        
        handleResize();
        animate();

        return () => {
          cancelAnimationFrame(animationFrameId);
          window.removeEventListener('mousemove', onMouseMove);
          if (resizeObserver) {
            resizeObserver.disconnect();
          } else {
            window.removeEventListener('resize', handleResize);
          }
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
              const res = await exchangeGoogleCode(response.code);

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
        
        <LandingHeader onLogin={handleLogin} onTrySandbox={() => setIsSandbox(true)} />
        
        <LandingHero onLogin={handleLogin} onTrySandbox={() => setIsSandbox(true)} />
        
        <LandingTicker bubbles={bubbles} />
        
        <LandingEditor 
          demoQuestion={demoQuestion} 
          setDemoQuestion={setDemoQuestion} 
          isAutoplayPaused={isAutoplayPaused} 
          cursorPos={cursorPos} 
          onInteract={handleUserActivity} 
        />
        
        <LandingFeatures />
        
        <LandingWorkflow />
        
        <LandingPillars />
        
        <LandingPositioning />
        
        <LandingThemeShowcase showcaseTheme={showcaseTheme} setShowcaseTheme={setShowcaseTheme} />
        
        <LandingTestimonials />
        
        <LandingCTA onLogin={handleLogin} onTrySandbox={() => setIsSandbox(true)} />
        
        <LandingFooter />
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
