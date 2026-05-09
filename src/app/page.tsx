"use client";

import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import SpendForm from "@/components/SpendForm";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen">
      {/* 1. Navbar + Hero Section Wrapper */}
      <div className="h-screen flex flex-col overflow-hidden relative">
        
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-5">
          <div className="max-w-[88rem] mx-auto flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7 text-black" />
              <span className="text-2xl font-medium tracking-tight text-black">CredMaster</span>
            </div>

            {/* Center: Links */}
            <div className="hidden md:flex items-center gap-8">
              {["Audit Engine", "Intelligence", "Security", "Partners", "Pricing"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Right: CTA */}
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200"
            >
              Run Audit
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 px-6 pt-20 pb-6 flex items-end">
          <div className="relative w-full rounded-2xl overflow-hidden max-w-[88rem] mx-auto h-[calc(100vh-96px)]">
            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4" type="video/mp4" />
            </video>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36 bg-gradient-to-r from-[#F5F5F5]/40 to-transparent">
              <h1 
                className="text-black text-5xl md:text-8xl font-semibold leading-[0.9] max-w-xl mb-6"
                style={{ 
                  letterSpacing: "-0.05em",
                  fontFamily: "var(--font-outfit), sans-serif"
                }}
              >
                Your Spend<br />
                Works Smarter
              </h1>
              <p 
                className="text-black/70 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                An automated, AI-powered audit engine built for deep spend analysis and effortless savings in your enterprise tool stack.
              </p>

              {/* Main CTA Pill */}
              <button 
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-all group"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Start Free Audit
                <div className="bg-white rounded-full p-2 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5 text-black" />
                </div>
              </button>

              {/* Hero Marquee */}
              <div className="mt-auto w-full max-w-2xl overflow-hidden pb-4">
                <div className="marquee-track">
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      <span className="mx-10 text-black/40 font-bold text-lg" style={{ fontFamily: "var(--font-outfit), sans-serif", letterSpacing: "-0.03em" }}>Stripe</span>
                      <span className="mx-10 text-black/40 font-bold text-lg" style={{ fontFamily: "var(--font-outfit), sans-serif", letterSpacing: "-0.03em" }}>Coinbase</span>
                      <span className="mx-10 text-black/40 font-bold text-lg" style={{ fontFamily: "var(--font-outfit), sans-serif", letterSpacing: "-0.03em" }}>Uniswap</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Info Section ("Meet CredMaster.") */}
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="max-w-[88rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
            <div>
              <h2 
                className="text-black text-4xl md:text-6xl font-medium leading-tight mb-8"
                style={{ letterSpacing: "-0.03em" }}
              >
                Meet CredMaster.
              </h2>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-6 pr-2 py-1.5 rounded-full hover:bg-gray-800 transition-all group"
              >
                Discover it
                <div className="bg-white rounded-full p-1.5">
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </button>
            </div>
            <div>
              <p className="text-black/70 text-2xl md:text-4xl leading-relaxed font-normal">
                CredMaster is a deep-learning auditor that identifies waste in your AI tool subscriptions, consolidating your stack for maximum performance.
              </p>
            </div>
          </div>

          {/* 4-col card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between relative overflow-hidden group"
              style={{ 
                backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <h3 className="text-black text-3xl font-medium tracking-tight" style={{ letterSpacing: "-0.02em" }}>Savings that bloom</h3>
              <p className="text-black/70 text-base max-w-xs relative z-10">
                Gain steady returns as your tooling budgets are routed into higher-efficiency AI platforms.
              </p>
              <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between text-white">
              <h3 className="text-2xl font-medium leading-tight">Always fluid,<br />always optimized.</h3>
              <p className="text-white/60 text-base">
                Maintain full control of your stack with on-demand audit refreshes — no waiting for monthly bills.
              </p>
            </div>

            <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between text-white">
              <h3 className="text-2xl font-medium leading-tight">Fully<br />Automated.</h3>
              <p className="text-white/60 text-base">
                Skip the task of auditing seats yourself. CredMaster runs in the background and alerts you to waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Backed By Section */}
      <section className="bg-[#F5F5F5] px-6 py-12 border-y border-gray-200">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div className="text-black/70 text-base leading-relaxed">
            Auditing spend for premier<br />partners and forward-thinking teams.
          </div>
          <div className="md:col-span-3 overflow-hidden">
            <div className="backers-track">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <span className="mx-10 text-black/40 font-normal" style={{ fontFamily: "serif", fontSize: "14px" }}>Fundamental Labs</span>
                  <span className="mx-10 text-black/40 font-black uppercase" style={{ fontFamily: "sans-serif", fontSize: "16px" }}>KUCOIN</span>
                  <span className="mx-10 text-black/40 font-bold" style={{ fontFamily: "Impact, sans-serif", fontSize: "18px" }}>NGC</span>
                  <span className="mx-10 text-black/40 font-semibold" style={{ fontFamily: "Georgia, serif", fontSize: "17px" }}>NxGen</span>
                  <span className="mx-10 text-black/40 font-bold" style={{ fontFamily: "Helvetica, sans-serif", fontSize: "15px" }}>Matter Labs</span>
                  <span className="mx-10 text-black/40 font-bold uppercase" style={{ fontFamily: "Verdana, sans-serif", fontSize: "14px" }}>DEXTools</span>
                  <span className="mx-10 text-black/40 font-bold" style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", letterSpacing: "0.18em" }}>NGRAVE</span>
                  <span className="mx-10 text-black/40 font-medium" style={{ fontFamily: "Palatino, serif", fontSize: "15px" }}>Polychain</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Testimonials Section */}
      <section className="bg-[#F5F5F5] px-6 py-24 border-b border-gray-200">
        <div className="max-w-[88rem] mx-auto">
          <div className="flex flex-col mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-black rounded-full" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Social Proof</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium text-black leading-tight" style={{ letterSpacing: "-0.03em" }}>
              847 teams have audited $3.2M in AI spend — <br />
              <span className="text-gray-400">average waste found: $1,400/month</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                "I assumed we had this under control. Turns out we had 14 seats of Copilot for engineers who'd switched to Cursor six months ago. That's $2,100 we were just burning."
              </p>
              <div>
                <p className="font-medium text-black">Marcus T.</p>
                <p className="text-sm text-gray-400">VP Engineering, Series B fintech</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                "The audit took three minutes and gave me exactly what I needed to walk into our Q2 finance review. Canceled two tools that week."
              </p>
              <div>
                <p className="font-medium text-black">Priya N.</p>
                <p className="text-sm text-gray-400">Engineering Manager, SaaS startup</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                "We thought we were being screwed by seat minimums. Turns out we just had overlapping tools no one had mapped. CredMaster made it obvious."
              </p>
              <div>
                <p className="font-medium text-black">Jordan K.</p>
                <p className="text-sm text-gray-400">CTO, 40-person B2B company</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Use Cases Section */}
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">CredMaster in Practice</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-semibold tracking-tighter text-black leading-[0.85] mb-8" style={{ letterSpacing: "-0.04em" }}>
              Audit <br />
              <span className="text-gray-300 italic">Modes.</span>
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed max-w-sm font-medium">
              CredMaster powers deep audits for builders, scale-ups and enterprises wanting lean toolstacks and zero waste.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden min-h-[720px] shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10 p-10 md:p-16 flex flex-col justify-end h-full bg-gradient-to-t from-black/40 to-transparent text-white">
              <h3 className="text-4xl md:text-6xl font-medium leading-tight mb-5" style={{ letterSpacing: "-0.03em" }}>Intelligence</h3>
              <p className="text-white/80 text-lg md:text-xl max-w-md mb-8 leading-relaxed">
                Lift team productivity by consolidating onto the best-in-class AI models while letting CredMaster manage the overhead.
              </p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center group-hover:bg-white transition-all transform group-hover:scale-110">
                  <ArrowRight className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-medium text-white group-hover:underline underline-offset-8">Run Audit Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <Footer />

      {/* Audit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-12 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-medium text-black mb-2 text-center" style={{ letterSpacing: "-0.03em" }}>Run Your AI Audit</h2>
              <p className="text-gray-500 text-center mb-10">Enter your tool stack details below to find waste.</p>
              <SpendForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
