import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import GrantProgramsSection from './components/GrantProgramsSection';
import NoticeBoardSection from './components/NoticeBoardSection';
import AboutSection from './components/AboutSection';
import StatsSection from './components/StatsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <GrantProgramsSection />
        <NoticeBoardSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}