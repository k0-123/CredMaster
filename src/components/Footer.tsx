"use client";

import React, { useEffect, useRef } from "react";
import { Globe, MessageSquare, Share2, Mail } from "lucide-react";

export const Footer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const fitWatermark = () => {
      if (svgRef.current && textRef.current) {
        try {
          const bbox = textRef.current.getBBox();
          svgRef.current.setAttribute(
            "viewBox",
            `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
          );
        } catch {
          // ignore
        }
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitWatermark);
    } else {
      window.addEventListener("load", fitWatermark);
    }
    window.addEventListener("resize", fitWatermark);
    
    const timer = setTimeout(fitWatermark, 150);
    
    return () => {
      window.removeEventListener("load", fitWatermark);
      window.removeEventListener("resize", fitWatermark);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="footer-section bg-[#F5F5F5] pt-16 pb-0 px-6 overflow-hidden flex flex-col items-center">
      <div className="footer-wrapper w-full max-w-[1150px] mx-auto grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4 items-stretch relative z-10">
        
        {/* Left Card — Video Background */}
        <div className="footer-left relative min-h-[360px] rounded-[32px] p-8 overflow-hidden flex flex-col justify-between shadow-2xl bg-black group">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4" type="video/mp4" />
          </video>

          <div className="footer-logo flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-sm">
              <span className="font-bold text-white text-lg tracking-tighter">C</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight drop-shadow-md">CredMaster</span>
          </div>

          <div className="mt-auto mb-10 relative z-10">
            <p className="text-white text-2xl leading-snug font-medium tracking-tight">
              Smarter spend audit,<br />
              <span className="text-white/50">powered by AI.</span>
            </p>
          </div>

          <div className="footer-social-row flex items-center justify-between gap-3 relative z-10">
            <span className="text-white/90 text-[18px] font-semibold italic" style={{ fontFamily: "'Caveat', cursive" }}>
              Stay in touch!
            </span>
            <div className="flex gap-2">
              {[Globe, MessageSquare, Share2, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer hover:-translate-y-1 shadow-xl group/icon text-white"
                >
                  <Icon className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card — Navigation */}
        <div className="footer-right bg-white rounded-[32px] p-10 md:p-12 flex flex-col justify-between relative shadow-xl border border-gray-100/50">
          
          {/* Floating Lucky Badge */}
          <div className="absolute -top-12 right-12 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
            <div className="w-28 h-28 rounded-[28px] rotate-[-12deg] bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center shadow-[inset_4px_4px_10px_rgba(255,255,255,0.2),inset_-4px_-4px_15px_rgba(0,0,0,0.4),10px_20px_40px_rgba(0,0,0,0.3)]">
              <span className="text-5xl font-bold text-white tracking-tighter rotate-[12deg] drop-shadow-2xl">C</span>
            </div>
            <div className="flex items-center gap-2 rotate-[-4deg] mt-2 ml-4">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20 C 6 14, 10 9, 18 5" />
                <path d="M18 5 L 12 5" />
                <path d="M18 5 L 18 11" />
              </svg>
              <span className="text-[22px] font-bold text-gray-400 whitespace-nowrap italic" style={{ fontFamily: "'Caveat', cursive" }}>
                Feeling lucky?
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-16 md:gap-32 pt-4">
            <div className="footer-col">
              <h4 className="text-[26px] font-bold italic text-gray-200 mb-6 tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>Navigation</h4>
              <ul className="space-y-4">
                {["How it works", "Features", "Pricing", "Testimonials", "FAQ"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[15px] font-bold text-black hover:text-indigo-600 transition-colors tracking-tight">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="text-[26px] font-bold italic text-gray-200 mb-6 tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>Company</h4>
              <ul className="space-y-4">
                {["Blog", "About", "Terms & Conditions", "Privacy Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[15px] font-bold text-black hover:text-indigo-600 transition-colors tracking-tight">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between mt-16 gap-8">
            <span className="text-[13px] font-bold text-gray-300 uppercase tracking-widest">
              © 2025 CredMaster
            </span>
            <div className="w-full sm:w-auto flex flex-col gap-5">
              <h4 className="text-[16px] text-gray-400 leading-tight">
                AI moves fast.<br />
                <strong className="block text-[22px] text-black font-bold tracking-tight mt-1">Stay ahead with CredMaster.</strong>
              </h4>
              <div className="flex items-center bg-[#F5F5F5] border border-gray-100 rounded-2xl p-2 shadow-inner w-full sm:w-[340px]">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="flex-1 px-4 py-2 bg-transparent text-[14px] text-black font-medium outline-none placeholder:text-gray-400"
                />
                <button className="px-6 py-3 bg-black text-white text-[14px] font-bold rounded-xl shadow-2xl hover:bg-gray-800 transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Watermark — Now flush with zero gaps */}
      <div className="footer-watermark w-full max-w-[1250px] mx-auto mt-0 mb-0 pointer-events-none select-none relative z-0" aria-hidden="true">
        <svg ref={svgRef} id="watermarkSvg" className="w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
          <text 
            ref={textRef}
            id="watermarkText" 
            x="500" 
            y="240" 
            textAnchor="middle" 
            fontSize="320" 
            className="font-bold tracking-tighter fill-black/[0.08]"
            style={{ fontFamily: "'TT Norms Pro', 'Inter', sans-serif" }}
          >
            CredMaster
          </text>
        </svg>
      </div>
    </section>
  );
};
