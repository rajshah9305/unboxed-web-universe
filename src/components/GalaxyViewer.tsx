
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import KnowledgeStar from "./KnowledgeStar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GalaxyViewer = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const galaxyRef = useRef<HTMLDivElement>(null);
  
  // Scale handling (zoom)
  const handleZoom = (zoomIn: boolean) => {
    setScale(prev => {
      const newScale = zoomIn ? prev * 1.2 : prev / 1.2;
      // Limit zoom
      return Math.min(Math.max(newScale, 0.5), 3);
    });
  };
  
  // Mouse wheel handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY < 0);
    };
    
    const galaxy = galaxyRef.current;
    if (galaxy) {
      galaxy.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (galaxy) {
        galaxy.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);
  
  // Reset view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Mouse dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Knowledge stars data
  const knowledgeStars = [
    {
      id: "star1",
      size: 20,
      position: { top: "20%", left: "25%" },
      color: "yellow" as const,
      title: "Quantum Computing",
      content: "Quantum computers use quantum bits or 'qubits' which can exist in multiple states simultaneously, potentially solving complex problems exponentially faster than classical computers."
    },
    {
      id: "star2",
      size: 15,
      position: { top: "35%", left: "60%" },
      color: "pink" as const,
      title: "Deep Ocean Discoveries",
      content: "More than 80% of the ocean remains unexplored. Scientists estimate there could be millions of undiscovered species living in the deep ocean trenches."
    },
    {
      id: "star3",
      size: 18,
      position: { top: "65%", left: "33%" },
      color: "cyan" as const,
      title: "Neural Networks",
      content: "Inspired by the human brain, neural networks learn to recognize patterns in data, forming the foundation of modern artificial intelligence and machine learning."
    },
    {
      id: "star4",
      size: 22,
      position: { top: "50%", left: "75%" },
      color: "yellow" as const,
      title: "Renewable Energy",
      content: "Solar panels only convert about 15-22% of sunlight into electricity. Researchers are developing materials that could potentially double this efficiency."
    },
    {
      id: "star5",
      size: 16,
      position: { top: "25%", right: "22%" },
      color: "cyan" as const,
      title: "Exoplanets",
      content: "Scientists have discovered over 5,000 planets outside our solar system. Some, called 'super-Earths,' have conditions potentially suitable for supporting life."
    },
    {
      id: "star6",
      size: 19,
      position: { bottom: "25%", right: "30%" },
      color: "pink" as const,
      title: "Biotechnology",
      content: "CRISPR gene editing technology allows scientists to precisely modify DNA sequences, offering potential treatments for genetic diseases and improvements in agriculture."
    },
    {
      id: "star7",
      size: 17,
      position: { bottom: "15%", left: "25%" },
      color: "yellow" as const,
      title: "Black Holes",
      content: "At the center of most galaxies lies a supermassive black hole. The one in our Milky Way, Sagittarius A*, is 4 million times the mass of our Sun."
    },
  ];
  
  return (
    <div 
      className="relative h-full w-full overflow-hidden cursor-move"
      ref={galaxyRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Galaxy visualization */}
      <motion.div
        className="absolute w-full h-full galaxy-gradient"
        style={{
          scale,
          translateX: position.x,
          translateY: position.y,
        }}
      >
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-cosmic-pink/10 animate-pulse-glow star-glow-pink"></div>
        
        {/* Constellation lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M25,20 L60,35 L33,65 L75,50 L60,35" 
            stroke="rgba(217, 70, 239, 0.3)" 
            strokeWidth="0.1" 
            fill="none"
          />
          <path 
            d="M25,20 L22,78 L75,50 L25,25" 
            stroke="rgba(14, 165, 233, 0.2)" 
            strokeWidth="0.1" 
            fill="none"
          />
        </svg>
        
        {/* Knowledge stars */}
        {knowledgeStars.map((star) => (
          <KnowledgeStar
            key={star.id}
            id={star.id}
            size={star.size}
            position={star.position}
            color={star.color}
            title={star.title}
            content={star.content}
          />
        ))}
      </motion.div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button
          onClick={() => handleZoom(true)}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted"
        >
          +
        </Button>
        <Button
          onClick={() => handleZoom(false)}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted"
        >
          -
        </Button>
        <Button
          onClick={resetView}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted"
        >
          ↺
        </Button>
      </div>
    </div>
  );
};

export default GalaxyViewer;
