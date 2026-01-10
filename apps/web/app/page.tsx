import Header from "./components/Header";
import Link from "next/link";

function CryptoIllustration() {
  return (
    <svg viewBox="0 0 380 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {/* Bar charts */}
      <rect x="60"  y="198" width="26" height="82" rx="3" fill="#b0b0b0" />
      <rect x="92"  y="218" width="26" height="62" rx="3" fill="#bcbcbc" />
      <rect x="124" y="235" width="26" height="45" rx="3" fill="#c8c8c8" />

      {/* Platform rings */}
      <ellipse cx="232" cy="278" rx="138" ry="36" fill="#c0c0c0" />
      <ellipse cx="232" cy="268" rx="118" ry="29" fill="#cacaca" />
      <ellipse cx="232" cy="258" rx="92"  ry="22" fill="#d4d4d4" />
      <ellipse cx="232" cy="250" rx="58"  ry="14" fill="#dadada" />

      {/* Diamond — upper prism */}
      <polygon points="232,82  282,182 232,205 182,182" fill="#2a2a2a" />
      <polygon points="232,82  182,182 232,205"          fill="#111111" />

      {/* Diamond — lower inverted */}
      <polygon points="232,205 282,182 232,252" fill="#363636" />
      <polygon points="232,205 182,182 232,252" fill="#222222" />

      {/* Compass ring */}
      <circle cx="232" cy="72" r="34" fill="white"   stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="232" cy="72" r="22" fill="#f0f0f0" stroke="#333"    strokeWidth="1.5" />
      <circle cx="232" cy="72" r="4"  fill="#1a1a1a" />
      <polygon points="232,50 238,70 226,70" fill="#1a1a1a" />
      <polygon points="232,94 238,74 226,74" fill="#aaaaaa" />

      {/* Connector */}
      <line x1="232" y1="106" x2="232" y2="118" stroke="#444" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/60 border border-gray-300 rounded-xl px-4 py-3 hover:bg-white transition-colors">
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm font-semibold text-black font-dm-sans">{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 font-dm-sans">
      <div className="bg-[#e8e8e8] rounded-3xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="relative">
          <Header />
        </div>

        {/* Hero */}
        <section className="flex-1 px-6 md:px-10 lg:px-14 pt-6 pb-10 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div className="flex-1 max-w-lg">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black leading-[1.0] tracking-tight font-dm-sans mb-5">
              Trade BTC<br />
              Perpetuals<br />
              With Xenova
            </h1>

            <p className="text-sm text-gray-500 font-dm-sans leading-relaxed mb-8 max-w-xs">
              Open leveraged BTC/USDC positions with real-time P&L, automated take-profit &amp; stop-loss, and instant execution powered by Redis streams.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                href="/register"
                className="bg-black text-white text-sm font-dm-sans font-bold px-7 py-3.5 rounded-xl border-2 border-black hover:bg-gray-900 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2.5 text-sm font-dm-sans text-gray-600 hover:text-black transition-colors"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-black transition-colors">
                  <svg className="w-3 h-3 ml-0.5" viewBox="0 0 10 12" fill="currentColor">
                    <path d="M0 0L10 6L0 12V0Z" />
                  </svg>
                </span>
                Learn how to Start
              </Link>
            </div>

            {/* Partner strip */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 opacity-40">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-bold font-dm-sans text-gray-600 tracking-tight">CoinTracker</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                <span className="text-xs font-bold font-dm-sans text-gray-600 tracking-widest uppercase">Reuters</span>
              </div>
            </div>
          </div>

          {/* Right — illustration + badges */}
          <div className="flex-1 flex flex-col items-end gap-4 max-w-lg w-full">
            <div className="w-full bg-gradient-to-b from-gray-200/60 to-transparent rounded-2xl p-2">
              <div className="h-60 md:h-72 lg:h-80">
                <CryptoIllustration />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <Badge
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label="Real-Time P&L"
              />
              <Badge
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label="100x Leverage"
              />
              <Badge
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label="Secure Trades"
              />
              <Badge
                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label="24/7 Support"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
