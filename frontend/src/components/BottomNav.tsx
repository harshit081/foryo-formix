import React from 'react';
import { LayoutGrid, FileText, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  // Map internal active tab values to index/button items
  const navItems = [
    { id: 'manager', label: 'Dashboard', icon: LayoutGrid },
    { id: 'builder', label: 'Forms', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[90%] sm:w-auto animate-slide-up">
      <nav className="flex items-center gap-1.5 p-2 rounded-full border border-white/10 bg-[#0f1015]/85 backdrop-blur-xl shadow-2xl justify-around sm:justify-start">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Determine if tab is active.
          // Note: if activeTab is actually 'importer' we can map it to 'builder' or keep highlight on manager
          const isActive = activeTab === item.id || (item.id === 'manager' && activeTab === 'importer');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium text-xs sm:text-sm cursor-pointer select-none transition-all duration-300
                ${
                  isActive
                    ? 'bg-[#2c283c] text-[#c2bfe3] border border-[#4a4269]/40 shadow-inner'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }
              `}
            >
              <Icon size={15} className="shrink-0 animate-pulse-subtle" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
