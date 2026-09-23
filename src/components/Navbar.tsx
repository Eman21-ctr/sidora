import { Activity, Radio, HelpCircle, Send, Users, Calendar, MessageSquare, Smartphone, FileBarChart2, Settings2, BellRing, Clock, Sparkles } from 'lucide-react';
import { BSPConfig } from '../types';
import { SidoraLogo } from './SidoraLogo';

export type NavTab = 'dashboard' | 'pasien' | 'otomasi' | 'simulator' | 'laporan';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  bspConfig: BSPConfig;
  isAutomationActive: boolean;

  onTriggerQuickSend: () => void;
  unreadRepliesCount: number;
  pendingQueueCount: number;
}

export const Navbar = ({
  currentTab,
  onSelectTab,
  bspConfig,
  isAutomationActive,

  onTriggerQuickSend,
  unreadRepliesCount,
  pendingQueueCount,
}: NavbarProps) => {
  // The 3 simplified main tabs as requested by the user
  const primaryTabs = [
    { id: 'dashboard' as NavTab, label: 'Dasbor Utama', icon: Activity },
    { id: 'pasien' as NavTab, label: 'Data Pasien & Caregiver', icon: Users },
    { 
      id: 'otomasi' as NavTab, 
      label: 'Setting Pesan Otomatis', 
      icon: BellRing,
      badge: isAutomationActive ? '🟢 Otomatis Aktif' : 'Dijeda',
      badgeColor: isAutomationActive ? 'bg-emerald-600' : 'bg-amber-600'
    },
  ];

  // Secondary tools for presentation/audit
  const secondaryTabs = [
    { 
      id: 'simulator' as NavTab, 
      label: 'Simulator Chat WA', 
      icon: Smartphone,
      badge: unreadRepliesCount > 0 ? `${unreadRepliesCount} balasan` : undefined,
    },
    { id: 'laporan' as NavTab, label: 'Laporan & Audit', icon: FileBarChart2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Logotext */}
          <div 
            className="cursor-pointer"
            onClick={() => onSelectTab('dashboard')}
            title="Kembali ke Dasbor Utama"
          >
            <SidoraLogo size="md" />
          </div>

          {/* Center/Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Automation Status Pill */}
            <div 
              onClick={() => onSelectTab('otomasi')}
              className="cursor-pointer hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Klik untuk membuka menu Setting Pesan Otomatis"
            >
              <span className={`w-2 h-2 rounded-full ${isAutomationActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div className="text-left leading-none">
                <span className="text-[10px] text-slate-400 block font-semibold">Jadwal Pengiriman</span>
                <span className="font-bold text-slate-800">
                  {isAutomationActive ? 'Tiap Hari 06:00 & H-3' : 'Otomasi Dijeda'}
                </span>
              </div>
            </div>



            {/* Fast Trigger Button for Demo Presentation */}
            <button
              onClick={onTriggerQuickSend}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all"
              title="Simulasikan eksekusi pengiriman otomatis jam 06:00 pagi sekarang juga untuk keperluan demo/presentasi"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Demo: Kirim Jam 06:00</span>
              <span className="sm:hidden">Demo Kirim</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar - Simplified to 3 Core Menus + Secondary Tools */}
      <div className="border-t border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* 3 Main Menus */}
          <nav className="flex space-x-1.5 sm:space-x-2 py-2 min-w-max">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-xs border border-emerald-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${
                        tab.badgeColor || 'bg-emerald-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary Tools (Simulator & Logs) */}
          <div className="hidden sm:flex items-center gap-1.5 py-2 pl-4 border-l border-slate-200 text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Alat Tambahan:
            </span>
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-0.5 px-1 py-0.2 rounded bg-emerald-500 text-white text-[9px]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
};

