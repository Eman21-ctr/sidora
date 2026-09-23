import { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share } from 'lucide-react';
import { SidoraLogo } from './SidoraLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    // Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // If browser doesn't support direct prompt, guide user
      setShowIOSModal(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || isDismissed) return null;

  return (
    <>
      {/* Floating Install Prompt Badge in bottom right / top */}
      <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-emerald-500/40 rounded-2xl shadow-2xl p-3 sm:p-3.5 flex items-center gap-3 max-w-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              Install Aplikasi Sidora
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-md font-mono">PWA</span>
            </h4>
            <p className="text-[11px] text-slate-300 truncate">Pasang ikon Sidora langsung di layar HP</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Manual Install Instruction Modal (For iOS Safari or Chrome guide) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <SidoraLogo size="sm" />
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Cara Pasang Sidora di Layar Utama HP:
              </h3>
              
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Buka Menu Browser HP</p>
                    <p className="text-slate-500">
                      Pada <b>Safari (iPhone)</b>: Tekan ikon <b>Share / Bagikan</b> (ikon kotak dengan panah ke atas <Share className="w-3 h-3 inline text-emerald-600" />).<br/>
                      Pada <b>Chrome (Android)</b>: Tekan titik tiga (<b>⋮</b>) di pojok kanan atas browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Pilih "Tambahkan ke Layar Utama"</p>
                    <p className="text-slate-500">
                      Cari dan pilih menu <b>"Add to Home Screen"</b> / <b>"Tambahkan ke Layar Utama"</b> atau <b>"Install App"</b>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Selesai! Ikon Sidora Siap Digunakan</p>
                    <p className="text-slate-500">
                      Ikon logo <b>Sidora</b> akan muncul di menu aplikasi HP Anda seperti aplikasi native dari Play Store / App Store.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
