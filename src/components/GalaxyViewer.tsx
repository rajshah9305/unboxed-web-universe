
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import KnowledgeStar from "./KnowledgeStar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Improved star placement for better visual distribution
const initialKnowledgeStars = [
  {
    id: "star1",
    size: 20,
    position: { top: "15%", left: "20%" },
    color: "yellow" as const,
    title: "Quantum Computing",
    content: "Quantum computers use quantum bits or 'qubits' which can exist in multiple states simultaneously, potentially solving complex problems exponentially faster than classical computers."
  },
  {
    id: "star2",
    size: 16,
    position: { top: "28%", left: "68%" },
    color: "pink" as const,
    title: "Deep Ocean Discoveries",
    content: "More than 80% of the ocean remains unexplored. Scientists estimate there could be millions of undiscovered species living in the deep ocean trenches."
  },
  {
    id: "star3",
    size: 18,
    position: { top: "75%", left: "25%" },
    color: "cyan" as const,
    title: "Neural Networks",
    content: "Inspired by the human brain, neural networks learn to recognize patterns in data, forming the foundation of modern artificial intelligence and machine learning."
  },
  {
    id: "star4",
    size: 22,
    position: { top: "42%", left: "82%" },
    color: "yellow" as const,
    title: "Renewable Energy",
    content: "Solar panels only convert about 15-22% of sunlight into electricity. Researchers are developing materials that could potentially double this efficiency."
  },
  {
    id: "star5",
    size: 17,
    position: { top: "18%", right: "15%" },
    color: "cyan" as const,
    title: "Exoplanets",
    content: "Scientists have discovered over 5,000 planets outside our solar system. Some, called 'super-Earths,' have conditions potentially suitable for supporting life."
  },
  {
    id: "star6",
    size: 19,
    position: { bottom: "22%", right: "28%" },
    color: "pink" as const,
    title: "Biotechnology",
    content: "CRISPR gene editing technology allows scientists to precisely modify DNA sequences, offering potential treatments for genetic diseases and improvements in agriculture."
  },
  {
    id: "star7",
    size: 17,
    position: { bottom: "12%", left: "15%" },
    color: "yellow" as const,
    title: "Black Holes",
    content: "At the center of most galaxies lies a supermassive black hole. The one in our Milky Way, Sagittarius A*, is 4 million times the mass of our Sun."
  },
];

const GalaxyViewer = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [knowledgeStars, setKnowledgeStars] = useState(initialKnowledgeStars);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
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
  
  // Knowledge star update handler
  const handleStarUpdate = (id: string, title: string, content: string) => {
    setKnowledgeStars(stars => 
      stars.map(star => 
        star.id === id 
          ? { ...star, title, content } 
          : star
      )
    );
    
    toast({
      title: "Star Updated",
      description: `Changes to "${title}" have been saved.`,
    });
  };
  
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
        
        {/* Constellation lines - enhanced for better visual appeal */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Primary constellation */}
          <path 
            d="M20,15 L68,28 L25,75 L82,42 L68,28" 
            stroke="rgba(217, 70, 239, 0.3)" 
            strokeWidth="0.1" 
            fill="none"
          />
          {/* Secondary constellation */}
          <path 
            d="M20,15 L15,82 L82,42 L20,15" 
            stroke="rgba(14, 165, 233, 0.2)" 
            strokeWidth="0.1" 
            fill="none"
          />
          {/* Tertiary constellation */}
          <path 
            d="M85,15 L68,28 L85,85 L25,75" 
            stroke="rgba(254, 240, 138, 0.2)" 
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
            onUpdate={handleStarUpdate}
          />
        ))}
        
        {/* Visual particles for cosmic atmosphere */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`particle-${i}`}
            className={`absolute rounded-full bg-white/20 animate-pulse-glow`}
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button
          onClick={() => handleZoom(true)}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted hover:bg-muted/40 transition-colors"
        >
          +
        </Button>
        <Button
          onClick={() => handleZoom(false)}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted hover:bg-muted/40 transition-colors"
        >
          -
        </Button>
        <Button
          onClick={resetView}
          variant="outline"
          size="icon"
          className="bg-muted/30 backdrop-blur-sm border-muted hover:bg-muted/40 transition-colors"
        >
          ↺
        </Button>
      </div>
    </div>
  );
};

export default GalaxyViewer;
