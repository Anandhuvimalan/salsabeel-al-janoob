"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function MemorialSection() {
  const [memorialData, setMemorialData] = useState<any>(null);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch memorial data from API on mount
  useEffect(() => {
    async function fetchMemorialData() {
      try {
        const res = await fetch("/api/aboutpage/memorial");
        if (!res.ok) {
          throw new Error("Failed to fetch memorial data");
        }
        const data = await res.json();
        setMemorialData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMemorialData();
  }, []);

  // Typewriter effect for fullMessage
  useEffect(() => {
    if (!memorialData) return;
    if (currentIndex < memorialData.fullMessage.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + memorialData.fullMessage[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => {
        setDisplayText("");
        setCurrentIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, memorialData]);

  // Auto-scroll container on text update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [displayText]);

  if (!memorialData) return <div>Loading...</div>;

  // Destructure the new "name" property along with others
  const { fullMessage, title, name, years, image } = memorialData;

  return (
    <section className="relative flex flex-col items-center justify-center py-16 px-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Memorial Image */}
      <div className="relative mb-8">
        <div className="absolute inset-[-4px] bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-lg" />
        <div className="relative">
          <Image
            src={image.src}
            alt={image.alt}
            width={240}
            height={320}
            className="relative z-10 object-cover shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Title, Name, and Years */}
      <h2 className="font-serif text-3xl font-normal tracking-wide mb-1">{title}</h2>
      <h3 className="font-serif text-2xl italic text-gray-700 mb-1">{name}</h3>
      <p className="text-lg italic text-gray-600 mb-12">{years}</p>

      {/* Animated Message */}
      <div className="relative w-full max-w-3xl min-h-[6rem] flex items-center justify-center">
        <div ref={containerRef} className="text-center p-4 bg-white overflow-hidden">
          <p className="text-xl md:text-2xl text-gray-700 font-serif">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    </section>
  );
}
