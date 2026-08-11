import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Users, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  const stats = [
    { label: "Active Learners", value: "12,000+", icon: Users },
    { label: "Expert Curated Courses", value: "150+", icon: BookOpen },
    { label: "Certifications Awarded", value: "8,500+", icon: Award },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
      {/* Top Header */}
      <header className="h-20 border-b border-border bg-white px-8 md:px-16 flex items-center justify-between shadow-xs">
        <Link href="/dashboard" className="flex items-center justify-start">
          <Image
            src="/xebia-logo.png"
            alt="Xebia Logo"
            width={120}
            height={60}
            className="object-contain"
            style={{ width: "120px", height: "auto" }}
            priority
          />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-dark text-white shadow-sm transition-all duration-200"
        >
          Sign In to Portal
        </Link>
      </header>

      {/* Hero Banner Section */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-16 py-16 bg-gradient-to-br from-primary-dark via-primary to-secondary text-white text-center sm:text-left relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-accent/20 to-transparent blur-3xl" />
        
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Xebia Academy Enterprise Education</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Accelerate Your Tech <span className="text-accent">Architectural</span> Journey
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Equip your engineering squads with structured capability pathways. Master App Router development, Reactive Spring systems, and Kubernetes deployments.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-bold bg-cta hover:bg-cta/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Explore My Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#details"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-bold border border-white/20 hover:bg-white/10 text-white transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Statistics counters bar */}
      <section className="bg-white border-y border-border py-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/5 rounded-full text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Detail Grid */}
      <section id="details" className="py-16 px-6 md:px-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Structured 5-Level Learning Matrix</h2>
          <p className="text-sm text-text-muted max-w-xl mx-auto">
            Our enterprise education model delivers micro-learning blocks governed by capability tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-3">
            <span className="text-xs font-bold text-accent uppercase tracking-wide">Level 1 - 2</span>
            <h3 className="text-lg font-bold text-foreground">Capabilities & Courses</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Explore capability tags like Frontend Architecture or Cloud DevOps, and enroll in dedicated multi-module paths designed by Principal Consultants.
            </p>
          </div>

          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-3">
            <span className="text-xs font-bold text-cta uppercase tracking-wide">Level 3 - 4</span>
            <h3 className="text-lg font-bold text-foreground">Modules & Lessons</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Courses are sliced into logical subject modules and submodules. Navigate lessons with the course player sidebar and track progress state dynamically.
            </p>
          </div>

          <div className="bg-white border border-border p-6 rounded-2xl shadow-xs space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Level 5</span>
            <h3 className="text-lg font-bold text-foreground">Interactive Content Blocks</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Interact with custom content blocks: code syntax copies, responsive video streams, tables, graphic diagrams, and warning alerts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="border-t border-border bg-white py-6 text-center text-xs text-text-muted mt-auto">
        &copy; {new Date().getFullYear()} Xebia Group. All rights reserved. Academy LMS Platform.
      </footer>
    </div>
  );
}
