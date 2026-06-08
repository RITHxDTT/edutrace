"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Viewmore from "./Viewmore";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
};

const slideTransition = { duration: 0.38, ease: "easeInOut" };

const card2Slides = [
  {
    title: "In HRD Room",
    desc: "The notification feature plays an important role in keeping both students updated in real time.",
  },
  {
    title: "Live Chat Rooms",
    desc: "Collaborate in real time with classmates and instructors through built-in messaging inside every session.",
  },
  {
    title: "Smart Reminders",
    desc: "Never miss a deadline. Get instant alerts for assessments, grading updates, and room activity.",
  },
];

const card3Slides = [
  {
    title: "Track your learning progress",
    desc: "Monitor completed tasks, scores and improvement over time.",
  },
  {
    title: "Your performance overview",
    desc: "See your scores, completion rates, and session hours at a glance.",
  },
];

function useCarousel(total: number, ms = 4000) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIdx((p) => (p + 1) % total);
    }, ms);
    return () => clearInterval(t);
  }, [total, ms]);

  const go = (i: number) => {
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  return { idx, dir, go };
}

export default function ModernRoom() {
  const c2 = useCarousel(3);
  const c3 = useCarousel(2, 4500);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
        <h2 className="font-medium text-3xl sm:text-4xl md:text-[48px] bg-accent-linear-purple bg-clip-text text-transparent">
          Built For Modern Room
        </h2>
        <p className="text-textDisable text-sm max-w-xs md:text-right mt-2 md:mt-0">
          In GrowthyFlow, instructors are not just teaching they are supported by a system designed.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">

        {/* Card 1 — unchanged */}
        <div className="flex-1 h-[500px] rounded-[32px] overflow-hidden group shadow-lg relative">
          <img
            src="/images/landingpage/dc.png"
            alt="Instructor"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-8 left-8">
            <Viewmore colors="text-white" border="border-white/20" />
          </div>
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-5xl font-black">1M+</h1>
            <p className="text-sm opacity-80 mt-1">
              Active students over <br />
              100+ student Master <br />
              at Korean
            </p>
          </div>
        </div>

        {/* Card 2 — Carousel */}
        <div className="flex-1 bg-linear-purple h-[500px] rounded-[32px] p-8 text-white flex flex-col shadow-lg overflow-hidden">
          <Viewmore colors="text-white" border="border-white/20" />

          <div className="flex-1 relative overflow-hidden mt-4">
            <AnimatePresence custom={c2.dir}>
              <motion.div
                key={c2.idx}
                custom={c2.dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-0 flex flex-col"
              >
                <h4 className="text-2xl font-bold">{card2Slides[c2.idx].title}</h4>
                <p className="text-xs opacity-70 mt-2 leading-relaxed">{card2Slides[c2.idx].desc}</p>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mt-4 flex-1 overflow-hidden">
                  {c2.idx === 0 && (
                    <>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.97 16.185V22.185C26.97 22.575 26.955 22.95 26.91 23.31C26.565 27.36 24.18 29.37 19.785 29.37H19.185C18.81 29.37 18.45 29.55 18.225 29.85L16.425 32.25C15.63 33.315 14.34 33.315 13.545 32.25L11.745 29.85C11.55 29.595 11.115 29.37 10.785 29.37H10.185C5.40001 29.37 3 28.185 3 22.185V16.185C3 11.79 5.02501 9.40501 9.06001 9.06001C9.42001 9.01501 9.79501 9 10.185 9H19.785C24.57 9 26.97 11.4 26.97 16.185Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M32.9701 10.185V16.185C32.9701 20.595 30.945 22.965 26.91 23.31C26.955 22.95 26.9701 22.575 26.9701 22.185V16.185C26.9701 11.4 24.57 9 19.785 9H10.1851C9.79506 9 9.42006 9.01501 9.06006 9.06001C9.40506 5.02501 11.7901 3 16.1851 3H25.785C30.57 3 32.9701 5.40001 32.9701 10.185Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.2432 19.875H20.2567" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.9932 19.875H15.0067" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.74325 19.875H9.75675" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="font-['Fredoka'] font-medium text-lg leading-tight mt-2 mb-2">
                        Real time <br /> Notification Alert
                      </div>
                      <img src="/images/landingpage/notification.png" alt="Notification visual asset" className="w-full h-auto" />
                    </>
                  )}

                  {c2.idx === 1 && (
                    <>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="font-['Fredoka'] font-medium text-lg leading-tight mt-2 mb-3">
                        Instant <br /> Messaging
                      </div>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-end">
                          <div className="w-6 h-6 rounded-full bg-white/30 flex-shrink-0" />
                          <div className="bg-white/20 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs">Did you submit the assignment?</div>
                        </div>
                        <div className="flex gap-2 items-end flex-row-reverse">
                          <div className="w-6 h-6 rounded-full bg-white/30 flex-shrink-0" />
                          <div className="bg-white/30 rounded-2xl rounded-br-sm px-3 py-1.5 text-xs">Yes, just finished it! 🎉</div>
                        </div>
                        <div className="flex gap-2 items-end">
                          <div className="w-6 h-6 rounded-full bg-white/30 flex-shrink-0" />
                          <div className="bg-white/20 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs">Great! Check your grade soon.</div>
                        </div>
                      </div>
                    </>
                  )}

                  {c2.idx === 2 && (
                    <>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="font-['Fredoka'] font-medium text-lg leading-tight mt-2 mb-3">
                        Smart <br /> Reminders
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-300 flex-shrink-0" />
                          <div className="text-xs">Assignment due in <span className="font-semibold">2 hours</span></div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                          <div className="w-2 h-2 rounded-full bg-green-300 flex-shrink-0" />
                          <div className="text-xs">Your submission was <span className="font-semibold">graded</span></div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                          <div className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0" />
                          <div className="text-xs">Meeting room <span className="font-semibold">opened</span> by instructor</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => c2.go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === c2.idx ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card 3 — Carousel */}
        <div className="flex-1 bg-white h-[500px] rounded-[32px] p-8 border border-gray-100 flex flex-col shadow-lg overflow-hidden">
          <Viewmore colors="text-indigo-600" border="border-indigo-600/20" />

          <div className="flex-1 relative overflow-hidden mt-4">
            <AnimatePresence custom={c3.dir}>
              <motion.div
                key={c3.idx}
                custom={c3.dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-0 flex flex-col"
              >
                <h4 className="text-2xl font-bold text-gray-800">{card3Slides[c3.idx].title}</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{card3Slides[c3.idx].desc}</p>

                <div className="flex-1 flex items-end mt-4">
                  {c3.idx === 0 && (
                    <img src="/images/landingpage/graph.png" alt="Analytics Graph" className="w-full h-auto rounded-[5px]" />
                  )}

                  {c3.idx === 1 && (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-xs text-gray-400">Completion Rate</p>
                          <p className="text-xl font-bold text-indigo-600">87%</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 11l3 3L22 4" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                          <p className="text-xs text-gray-400">Avg Score</p>
                          <p className="text-lg font-bold text-gray-800">92 <span className="text-xs font-normal text-gray-400">pts</span></p>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                          <p className="text-xs text-gray-400">Sessions</p>
                          <p className="text-lg font-bold text-gray-800">24 <span className="text-xs font-normal text-gray-400">hrs</span></p>
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1.5">Weekly Progress</p>
                        <div className="flex items-end gap-1 h-8">
                          {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="flex mt-1">
                          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                            <span key={i} className="text-[9px] text-gray-400 flex-1 text-center">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => c3.go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === c3.idx ? "w-6 bg-indigo-600" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
