"use client";

import React, { useEffect, useRef } from "react";
import { LogoIcon } from "./LogoIcon";
import { ArrowRight, Twitter, Linkedin, Github, Mail } from "lucide-react";

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
        } catch (e) {
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
    
    // Initial call after a short delay to ensure font swap
    const timer = setTimeout(fitWatermark, 100);
    
    return () => {
      window.removeEventListener("load", fitWatermark);
      window.removeEventListener("resize", fitWatermark);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="footer-section bg-[#F5F5F5] py-12 px-6 overflow-hidden">
      <div className="footer-wrapper max-w-[1150px] mx-auto grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4 items-stretch">
        
        {/* Left Card — Video Background */}
        <div className="footer-left relative min-h-[340px] rounded-[28px] p-8 overflow-hidden flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4" type="video/mp4" />
          </video>

          <div className="footer-logo flex items-center gap-2.5 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/15 border-[1.5px] border-white/85 flex items-center justify-center">
              <span className="font-bold text-white text-base tracking-tighter">C</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">CredMaster</span>
          </div>

          <div className="mt-auto mb-7 relative z-10">
            <p className="text-white text-xl leading-relaxed font-normal">
              Smarter spend audit,<br />
              <span className="text-white/60">powered by AI.</span>
            </p>
          </div>

          <div className="footer-social-row flex items-center justify-between gap-3 relative z-10">
            <span className="text-white/90 text-[17px] font-semibold italic" style={{ fontFamily: "'Caveat', cursive" }}>
              Stay in touch!
            </span>
            <div className="flex gap-2">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-xl bg-[#0e1014] hover:bg-black flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 shadow-lg group"
                >
                  <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card — Navigation */}
        <div className="footer-right bg-white rounded-[28px] p-10 flex flex-col justify-between relative shadow-sm border border-gray-100/50">
          
          {/* Floating Lucky Badge */}
          <div className="absolute -top-9 right-10 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
            <div className="w-24 h-24 rounded-[22px] rotate-[-10deg] bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center shadow-[inset_3px_3px_8px_rgba(255,255,255,0.2),inset_-3px_-3px_12px_rgba(0,0,0,0.3),8px_14px_28px_rgba(0,0,0,0.2)]">
              <span className="text-4xl font-bold text-white tracking-tighter rotate-[10deg] drop-shadow-lg">C</span>
            </div>
            <div className="flex items-center gap-1.5 rotate-[-4deg] mt-1 ml-2">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20 C 6 14, 10 9, 18 5" />
                <path d="M18 5 L 12 5" />
                <path d="M18 5 L 18 11" />
              </svg>
              <span className="text-[20px] font-semibold text-gray-400 whitespace-nowrap italic" style={{ fontFamily: "'Caveat', cursive" }}>
                Feeling lucky?
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-16 md:gap-24 pt-2">
            <div className="footer-col">
              <h4 className="text-[24px] font-semibold italic text-gray-300 mb-5 tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>Navigation</h4>
              <ul className="space-y-3.5">
                {["How it works", "Features", "Pricing", "Testimonials", "FAQ"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] font-semibold text-black hover:text-indigo-600 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="text-[24px] font-semibold italic text-gray-300 mb-5 tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>Company</h4>
              <ul className="space-y-3.5">
                {["Blog", "About", "Terms & Conditions", "Privacy Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] font-semibold text-black hover:text-indigo-600 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between mt-12 gap-8">
            <span className="text-[12.5px] font-medium text-gray-400">
              © 2025 CredMaster. All rights reserved.
            </span>
            <div className="w-full sm:w-auto flex flex-col gap-4">
              <h4 className="text-[15px] text-gray-500 leading-relaxed">
                AI moves fast.<br />
                <strong className="block text-[19px] text-black font-bold">Stay ahead with CredMaster.</strong>
              </h4>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm w-full sm:w-[310px]">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="flex-1 px-4 py-2 bg-transparent text-[13.5px] text-black outline-none placeholder:text-gray-400"
                />
                <button className="px-5 py-2.5 bg-black text-white text-[13.5px] font-semibold rounded-lg shadow-xl hover:bg-gray-800 transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Watermark */}
      <div className="footer-watermark max-w-[1150px] mx-auto -mt-16 pointer-events-none select-none relative z-0 opacity-10" aria-hidden="true">
        <svg ref={svgRef} id="watermarkSvg" className="w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
          <text 
            ref={textRef}
            id="watermarkText" 
            x="500" 
            y="240" 
            textAnchor="middle" 
            fontSize="320" 
            className="font-bold tracking-tighter fill-black/5"
            style={{ fontFamily: "'TT Norms Pro', 'Inter', sans-serif" }}
          >
            CredMaster
          </text>
        </svg>
      </div>
    </section>
  );
};
