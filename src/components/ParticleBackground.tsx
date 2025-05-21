
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  // Setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(window.innerWidth / 2.5, 350); // Increased particle count
      const particles: Particle[] = [];
      
      const colors = [
        'rgba(254, 240, 138, 0.7)', // yellow
        'rgba(217, 70, 239, 0.7)',  // pink
        'rgba(14, 165, 233, 0.7)',  // cyan
        'rgba(255, 255, 255, 0.7)',  // white
        'rgba(76, 109, 217, 0.7)',  // deep blue
        'rgba(118, 76, 217, 0.7)'   // muted purple
      ];
      
      for (let i = 0; i < particleCount; i++) {
        const baseOpacity = Math.random() * 0.5 + 0.2;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.1,
          speedX: (Math.random() - 0.5) * 0.5, // Increased speed variability
          speedY: (Math.random() - 0.5) * 0.5, // Increased speed variability
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
          twinkleSpeed: Math.random() * 0.05 + 0.01 // Random speed for twinkle
        });
      }
      
      particlesRef.current = particles;
    };
    
    createParticles();
    
    // Mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
      
      // Clear timeout if exists
      if (window.mouseTimeout) {
        clearTimeout(window.mouseTimeout);
      }
      
      // Set timeout to reset mouse active state
      window.mouseTimeout = setTimeout(() => {
        mouseRef.current.isActive = false;
      }, 500);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Mouse interactions - particles follow mouse slightly
        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 2000;
            
            particle.speedX += Math.cos(angle) * force;
            particle.speedY += Math.sin(angle) * force;
            
            // Limit speed
            const maxSpeed = 0.8;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
              particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
              particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
          }
        }
        
        // Twinkle effect
        // Cycle opacity using a sine wave for smooth transition
        particle.opacity = particle.baseOpacity * (0.5 + 0.5 * Math.sin(Date.now() * particle.twinkleSpeed));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        // Apply current opacity to the particle's color
        const originalColor = particle.color.substring(particle.color.indexOf('(') + 1, particle.color.lastIndexOf(')')).split(',');
        ctx.fillStyle = `rgba(${originalColor[0]}, ${originalColor[1]}, ${originalColor[2]}, ${particle.opacity})`;
        ctx.closePath();
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (window.mouseTimeout) {
        clearTimeout(window.mouseTimeout);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-90"
    />
  );
};

// Add interface to window for TypeScript
declare global {
  interface Window {
    mouseTimeout: number | NodeJS.Timeout;
  }
}

export default ParticleBackground;
