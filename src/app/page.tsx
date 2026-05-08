"use client";

import React, { useState } from "react";
import { ArrowRight, Menu, X, Shield, Zap, BarChart3, ChevronRight } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import SpendForm from "@/components/SpendForm";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen font-sans selection:bg-black selection:text-white">
      {/* Navbar + Hero Section */}
      <section className="h-screen flex flex-col relative overflow-hidden bg-white">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale pointer-events-none"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4" type="video/mp4" />
        </video>

        {/* Global Nav */}
        <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-[88rem] mx-auto w-full">
          <div className="flex items-center gap-2 group cursor-pointer">
            <LogoIcon className="w-8 h-8 text-black transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-semibold tracking-tighter text-black">CredMaster</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {["Engine", "Intelligence", "Pricing", "About"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            Start Audit
          </button>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-black/60">Live Production Audit Engine</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-black max-w-4xl leading-[0.9] mb-8">
            The AI Auditor for <br />
            <span className="text-gray-300 italic">Scale-ups.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mb-12">
            Automate your AI spend auditing. Save up to 40% on monthly overhead without changing your stack.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-gray-800 transition-all group flex items-center gap-3"
            >
              Run Audit Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-full text-lg font-medium text-black hover:bg-black/5 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Bottom Marquee Overlay */}
        <div className="absolute bottom-10 left-0 w-full overflow-hidden whitespace-nowrap opacity-20 pointer-events-none select-none">
          <div className="inline-block animate-marquee text-[120px] font-bold text-black/10 tracking-tighter px-10 uppercase">
            AUDIT &bull; OPTIMIZE &bull; SCALE &bull; AUTOMATE &bull; AUDIT &bull; OPTIMIZE &bull; SCALE &bull; AUTOMATE &bull;
          </div>
        </div>
      </section>

      {/* Bento Grid — Audit Modes Improved */}
      <section id="engine" className="py-32 px-8 bg-[#F5F5F5]">
        <div className="max-w-[88rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-20 items-start mb-24">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6 block">CredMaster in Practice</span>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-black leading-[0.9] mb-8">
                Intelligent <br />Audit Modes.
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed max-w-md">
                CredMaster powers deep audits for builders, scale-ups and enterprises wanting lean toolstacks and zero waste.
              </p>
            </div>

            {/* Bento Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {/* Intelligence Card - Main Featured */}
              <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[40px] bg-white shadow-2xl shadow-black/5 border border-white/80 h-[500px] md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent z-0" />
                <div className="relative z-10 p-12 h-full flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-10 shadow-xl shadow-indigo-500/20">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-semibold tracking-tight text-black mb-6">Intelligence</h3>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-sm mb-10">
                    Lift team productivity by consolidating onto the best-in-class AI models while letting CredMaster manage the overhead.
                  </p>
                  <button onClick={() => setIsFormOpen(true)} className="mt-auto group flex items-center gap-3 text-black font-bold text-lg">
                    <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-6 h-6" />
                    </span>
                    Run Audit Now
                  </button>
                </div>
                <img 
                  src="https://framerusercontent.com/images/k2m7f7B9xO0X7j9wX8f2q3r5g.png?rect=0,0,1000,1000" 
                  alt="Architecture" 
                  className="absolute bottom-0 right-0 w-3/4 translate-x-1/4 translate-y-1/4 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80"
                />
              </div>

              {/* Compliance Card */}
              <div className="relative group overflow-hidden rounded-[40px] bg-white shadow-xl shadow-black/5 border border-white/80 p-10 flex flex-col justify-between hover:border-black/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-8 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-black mb-4">Compliance</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Ensure all your AI tool usage adheres to internal policy and security guidelines automatically.
                  </p>
                  <a href="#" className="flex items-center gap-2 text-black font-bold text-sm group/link">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Efficiency Card */}
              <div className="relative group overflow-hidden rounded-[40px] bg-black shadow-2xl p-10 flex flex-col justify-between text-white hover:scale-[1.02] transition-all">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-8 relative z-10">
                  <BarChart3 className="w-6 h-6 text-black" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Efficiency</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    Real-time cost visualization and automated subscription downgrades for unused seats.
                  </p>
                  <a href="#" className="flex items-center gap-2 text-white font-bold text-sm group/link">
                    Optimize
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Row */}
          <div className="pt-24 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Trusted by modern engineering teams</span>
            <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale filter invert">
              {["Stripe", "OpenAI", "Anthropic", "Vercel", "Retool"].map((logo) => (
                <span key={logo} className="text-2xl font-bold tracking-tighter text-black">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <Footer />

      {/* Audit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-20"
            >
              <X className="w-6 h-6 text-black" />
            </button>
            <div className="p-10 md:p-16">
              <div className="mb-12">
                <h2 className="text-4xl font-semibold tracking-tighter text-black mb-4">Start your audit.</h2>
                <p className="text-gray-500 max-w-md">Enter your current stack and team details to get a live efficiency report in under 60 seconds.</p>
              </div>
              <SpendForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
