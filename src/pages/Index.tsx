
import React from "react";
import ParticleBackground from "@/components/ParticleBackground";
import GalaxyViewer from "@/components/GalaxyViewer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Main content */}
      <div className="relative z-30 h-full">
        <Header />
        <GalaxyViewer />
      </div>
    </div>
  );
};

export default Index;
