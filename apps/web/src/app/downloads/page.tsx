"use client";

import { useState } from "react";
import Link from "next/link";

export default function Downloads() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const apkUrl = "https://github.com/0giinn0/Rou_Tein/releases/latest";
  const expoUrl = "https://expo.dev/accounts/0giinn0/projects/rou-tein/builds";
  const webUrl = typeof window !== "undefined" ? window.location.origin : "";
  const qrBase = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";

  return (
    <div className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2c] max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Rou<span className="text-[#ff6b6b]">_</span>Tein
        </Link>
        <Link
          href="/"
          className="text-sm text-[#7a7a7c] hover:text-[#f5f5f5] transition-colors"
        >
          Back to app
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Download</h1>
          <p className="text-[#7a7a7c] max-w-lg mx-auto leading-relaxed">
            Install Rou_Tein on your device and start building streaks, tracking
            workouts, and leveling up your daily habits.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#0f0f10] border border-[#2a2a2c] rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span className="text-[#7a7a7c]">Version 1.0.0</span>
          </div>
        </section>

        {/* Android */}
        <section className="bg-[#0f0f10] border border-[#2a2a2c] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <img
            src={`${qrBase}${encodeURIComponent(apkUrl)}`}
            alt="QR code for Android APK download"
            className="w-44 h-44 rounded-2xl bg-white p-2 shrink-0"
          />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-3xl">&#x1f4f1;</span>
              <h2 className="text-2xl font-bold">Android — APK</h2>
            </div>
            <p className="text-sm text-[#7a7a7c] leading-relaxed">
              Download the APK directly to your Android device. Enable{" "}
              <strong>Install from unknown sources</strong> in Settings, then tap
              the APK to install.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#34d399] text-[#070707] font-bold px-6 py-3 rounded-2xl hover:bg-[#2dd4bf] transition-colors text-sm"
              >
                Download APK
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
              <button
                onClick={() => copy(apkUrl, "apk")}
                className="inline-flex items-center gap-2 bg-[#1a1a1c] text-[#f5f5f5] font-semibold px-5 py-3 rounded-2xl border border-[#2a2a2c] hover:bg-[#2a2a2c] transition-colors text-sm"
              >
                {copied === "apk" ? "Copied!" : "Copy link"}
              </button>
            </div>
            <p className="text-xs text-[#4a4a4c]">
              Built via EAS Build. Also available on the{" "}
              <a href={expoUrl} className="text-[#a78bfa] underline" target="_blank" rel="noopener noreferrer">
                Expo dashboard
              </a>.
            </p>
          </div>
        </section>

        {/* iOS */}
        <section className="bg-[#0f0f10] border border-[#2a2a2c] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <img
            src={`${qrBase}${encodeURIComponent("https://testflight.apple.com/join/routein")}`}
            alt="QR code for iOS TestFlight"
            className="w-44 h-44 rounded-2xl bg-white p-2 shrink-0"
          />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-3xl">&#x1f34e;</span>
              <h2 className="text-2xl font-bold">iOS — TestFlight</h2>
            </div>
            <p className="text-sm text-[#7a7a7c] leading-relaxed">
              Join the iOS beta via Apple TestFlight. Install the TestFlight app
              from the App Store, then tap the button below to get started.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://testflight.apple.com/join/routein"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#38bdf8] text-[#070707] font-bold px-6 py-3 rounded-2xl hover:bg-[#0ea5e9] transition-colors text-sm"
              >
                Join TestFlight
              </a>
              <button
                onClick={() => copy("https://testflight.apple.com/join/routein", "ios")}
                className="inline-flex items-center gap-2 bg-[#1a1a1c] text-[#f5f5f5] font-semibold px-5 py-3 rounded-2xl border border-[#2a2a2c] hover:bg-[#2a2a2c] transition-colors text-sm"
              >
                {copied === "ios" ? "Copied!" : "Copy link"}
              </button>
            </div>
            <p className="text-xs text-[#4a4a4c]">
              Requires an Apple Developer account. Built via EAS Build + EAS Submit.
            </p>
          </div>
        </section>

        {/* Web */}
        <section className="bg-[#0f0f10] border border-[#2a2a2c] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <img
            src={`${qrBase}${encodeURIComponent(webUrl || "https://routein.app")}`}
            alt="QR code for web app"
            className="w-44 h-44 rounded-2xl bg-white p-2 shrink-0"
          />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-3xl">&#x1f310;</span>
              <h2 className="text-2xl font-bold">Web App</h2>
            </div>
            <p className="text-sm text-[#7a7a7c] leading-relaxed">
              Access Rou_Tein from any browser — no install required. Scan the QR
              code or tap the button to open the web version.
            </p>
            <a
              href={webUrl || "/"}
              className="inline-flex items-center gap-2 bg-[#a78bfa] text-[#070707] font-bold px-6 py-3 rounded-2xl hover:bg-[#8b5cf6] transition-colors text-sm"
            >
              Open Web App
            </a>
          </div>
        </section>

        {/* Instructions */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-center">How to Install on Android</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Download APK",
                desc: "Tap the Download button above to get the latest APK file.",
              },
              {
                step: "2",
                title: "Allow installs",
                desc: "Go to Settings \u2192 Security \u2192 enable 'Unknown sources' for your browser.",
              },
              {
                step: "3",
                title: "Install & open",
                desc: "Open the APK from your Downloads folder. Tap Install, then open Rou_Tein.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[#0f0f10] border border-[#2a2a2c] rounded-2xl p-6 text-center space-y-3"
              >
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[#ff6b6b] text-[#070707] font-extrabold text-lg">
                  {item.step}
                </span>
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-xs text-[#7a7a7c] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-[#4a4a4c] pb-10">
          Rou_Tein &copy; {new Date().getFullYear()} &mdash; Built with React
          Native, Next.js, and Expo.
        </footer>
      </main>
    </div>
  );
}
