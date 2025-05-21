
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface KnowledgeStarProps {
  id: string;
  size: number;
  position: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  color: "yellow" | "pink" | "cyan";
  title: string;
  content: string;
}

const KnowledgeStar: React.FC<KnowledgeStarProps> = ({
  id,
  size,
  position,
  color,
  title,
  content,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const handleStarClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const colorClasses = {
    yellow: "bg-cosmic-yellow before:shadow-cosmic-yellow/40",
    pink: "bg-cosmic-pink before:shadow-cosmic-pink/40",
    cyan: "bg-cosmic-cyan before:shadow-cosmic-cyan/40",
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...position,
      }}
      className={cn(
        "knowledge-star star-glow",
        colorClasses[color],
        isExpanded ? "z-50" : ""
      )}
      onClick={handleStarClick}
      id={id}
    >
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute w-72 md:w-96 bg-muted/90 backdrop-blur-md rounded-lg p-4 shadow-lg",
            "transform transition-all duration-500 animate-fade-in",
            isMobile ? "top-8 left-0" : "top-full mt-2 left-1/2 -translate-x-1/2"
          )}
          style={{
            boxShadow: `0 4px 20px rgba(${color === 'yellow' ? '254, 240, 138' : 
              color === 'pink' ? '217, 70, 239' : '14, 165, 233'}, 0.3)`,
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
            onClick={handleClose}
          >
            ×
          </Button>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-foreground/80">{content}</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeStar;
