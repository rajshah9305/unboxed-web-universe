
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import KnowledgeStar from "./KnowledgeStar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { KnowledgeStarProvider } from "@/context/KnowledgeStarContext";

// Enhanced knowledge stars with more realistic astronomy-themed content
const initialKnowledgeStars = [
  {
    id: "star1",
    size: 18,
    position: { top: "15%", left: "20%" },
    color: "yellow" as const,
    title: "Supernova Remnants",
    content: "When massive stars end their lives in spectacular explosions called supernovae, they leave behind beautiful nebulae of gas and dust. The Crab Nebula is one of the most famous examples, formed from a supernova observed by Chinese astronomers in 1054 CE."
  },
  {
    id: "star2",
    size: 16,
    position: { top: "35%", left: "78%" },
    color: "pink" as const,
    title: "Black Hole at M87",
    content: "In April 2019, the Event Horizon Telescope collaboration revealed the first-ever image of a black hole's shadow. This supermassive black hole sits at the center of galaxy M87, about 55 million light-years from Earth, and has a mass approximately 6.5 billion times that of our Sun."
  },
  {
    id: "star3",
    size: 20,
    position: { top: "65%", left: "25%" },
    color: "cyan" as const,
    title: "Stellar Nebulae",
    content: "Nebulae are vast clouds of gas and dust in space. Some, like the famous Orion Nebula, are stellar nurseries where new stars are born. Others, like the Helix Nebula, are formed by dying stars shedding their outer layers."
  },
  {
    id: "star4",
    size: 22,
    position: { top: "42%", left: "45%" },
    color: "yellow" as const,
    title: "Exoplanet Discoveries",
    content: "NASA's TESS mission is discovering thousands of exoplanets around nearby stars. Some of these planets orbit in their star's habitable zone, where liquid water could exist. The nearest potentially habitable exoplanet, Proxima Centauri b, is just over 4 light-years away."
  },
  {
    id: "star5",
    size: 17,
    position: { top: "22%", right: "25%" },
    color: "cyan" as const,
    title: "Cosmic Microwave Background",
    content: "The Cosmic Microwave Background (CMB) is the afterglow of the Big Bang, detected as faint radiation permeating all of space. First discovered accidentally in 1965, detailed measurements of the CMB by satellites like WMAP and Planck have helped cosmologists determine the age and composition of the universe."
  },
  {
    id: "star6",
    size: 19,
    position: { bottom: "28%", right: "18%" },
    color: "pink" as const,
    title: "Dark Matter",
    content: "Dark matter makes up about 85% of the total matter in the universe but doesn't interact with light. Its existence is inferred from its gravitational effects on visible matter, like the rotation curves of galaxies and gravitational lensing. Scientists are still trying to detect dark matter particles directly."
  },
  {
    id: "star7",
    size: 16,
    position: { bottom: "18%", left: "35%" },
    color: "yellow" as const,
    title: "Stellar Evolution",
    content: "Stars follow predictable life cycles based on their mass. Our Sun, a medium-mass star, will eventually become a red giant before shedding its outer layers to form a planetary nebula, leaving behind a white dwarf. More massive stars may end their lives as supernovae, potentially becoming neutron stars or black holes."
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
      description: `Your changes to "${title}" have been saved.`,
    });
  };
  
  // Generate random background stars
  const generateBackgroundStars = () => {
    const stars = [];
    const starClasses = ["star-tiny", "star-small", "star-medium", "star-large"];
    const starColors = ["bg-white", "bg-yellow-100", "bg-blue-100"];
    
    // Generate 300+ stars for a realistic night sky
    for (let i = 0; i < 300; i++) {
      const size = starClasses[Math.floor(Math.random() * starClasses.length)];
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${Math.random() * 3 + 2}s`;
      
      stars.push(
        <div
          key={`bg-star-${i}`}
          className={`absolute rounded-full ${size} ${color} opacity-70`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationName: 'twinkle',
            animationDuration,
            animationDelay,
            animationIterationCount: 'infinite'
          }}
        />
      );
    }
    
    return stars;
  };
  
  return (
    <KnowledgeStarProvider>
      <div 
        className="relative h-full w-full overflow-hidden cursor-move bg-[#0a0d1f]"
        ref={galaxyRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Static background stars that don't move with panning */}
        <div className="absolute inset-0 overflow-hidden">
          {generateBackgroundStars()}
        </div>
        
        {/* Galaxy visualization that moves with panning */}
        <motion.div
          className="absolute w-full h-full galaxy-gradient"
          style={{
            scale,
            translateX: position.x,
            translateY: position.y,
          }}
        >
          {/* Distant nebula effect */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Primary constellation */}
            <path 
              d="M20,15 L68,28 L25,75 L82,42 L68,28" 
              stroke="rgba(255, 255, 255, 0.15)" 
              strokeWidth="0.15" 
              fill="none"
            />
            {/* Secondary constellation */}
            <path 
              d="M20,15 L15,82 L82,42 L20,15" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="0.15" 
              fill="none"
            />
            {/* Tertiary constellation */}
            <path 
              d="M85,15 L68,28 L85,85 L25,75" 
              stroke="rgba(255, 255, 255, 0.08)" 
              strokeWidth="0.15" 
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
          
          {/* Dust clouds for nebula effect */}
          <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="absolute top-2/3 left-2/3 w-40 h-40 rounded-full bg-pink-500/5 blur-3xl"></div>
        </motion.div>
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-50">
          <Button
            onClick={() => handleZoom(true)}
            variant="outline"
            size="icon"
            className="bg-muted/20 backdrop-blur-sm border-white/10 hover:bg-muted/40 transition-colors text-white"
          >
            +
          </Button>
          <Button
            onClick={() => handleZoom(false)}
            variant="outline"
            size="icon"
            className="bg-muted/20 backdrop-blur-sm border-white/10 hover:bg-muted/40 transition-colors text-white"
          >
            -
          </Button>
          <Button
            onClick={resetView}
            variant="outline"
            size="icon"
            className="bg-muted/20 backdrop-blur-sm border-white/10 hover:bg-muted/40 transition-colors text-white"
          >
            ↺
          </Button>
        </div>
      </div>
    </KnowledgeStarProvider>
  );
};

export default GalaxyViewer;
