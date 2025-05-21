import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pencil, Check } from "lucide-react";
import { useKnowledgeStar } from "@/context/KnowledgeStarContext";

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
  onUpdate?: (id: string, title: string, content: string) => void;
}

const KnowledgeStar: React.FC<KnowledgeStarProps> = ({
  id,
  size,
  position,
  color,
  title,
  content,
  onUpdate,
}) => {
  const { activeStarId, setActiveStarId } = useKnowledgeStar();
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableContent, setEditableContent] = useState(content);
  const isMobile = useIsMobile();
  const timerRef = useRef<number | null>(null);
  
  // Determine if this star is expanded based on the active star ID
  const isExpanded = activeStarId === id;
  
  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Set a timer when the popup is expanded and not being edited
  useEffect(() => {
    if (isExpanded && !isEditing) {
      // Close the popup after 10 seconds
      timerRef.current = window.setTimeout(() => {
        setActiveStarId(null);
      }, 10000); // 10 seconds
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isExpanded, isEditing, setActiveStarId]);
  
  const handleStarClick = () => {
    if (!isEditing) {
      // If this star is already expanded, close it
      // Otherwise, set this star as the active one (which will close any other open ones)
      setActiveStarId(isExpanded ? null : id);
      
      // Clear any existing timer when manually toggling
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStarId(null);
    setIsEditing(false);
    
    // Reset to original content if editing was canceled
    if (isEditing) {
      setEditableTitle(title);
      setEditableContent(content);
    }
    
    // Clear the timer when manually closing
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    
    // Clear timer when editing starts
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    
    // Call parent update function with new content
    if (onUpdate) {
      onUpdate(id, editableTitle, editableContent);
    }
    
    // Restart the auto-close timer after saving
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setActiveStarId(null);
    }, 10000);
  };

  const colorClasses = {
    yellow: "bg-cosmic-yellow before:shadow-cosmic-yellow/40",
    pink: "bg-cosmic-pink before:shadow-cosmic-pink/40",
    cyan: "bg-cosmic-cyan before:shadow-cosmic-cyan/40",
  };

  // Prevent popup clicks from closing it
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...position,
      }}
      className={cn(
        "knowledge-star star-glow absolute",
        colorClasses[color],
        isExpanded ? "z-50" : ""
      )}
      onClick={handleStarClick}
      id={id}
    >
      {isExpanded && (
        <div
          onClick={handlePopupClick}
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
          <div className="flex justify-between items-center mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-lg font-bold bg-background/50 border border-primary/30 rounded px-2 py-1 w-full mr-2"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className="text-lg font-bold">{editableTitle}</h3>
            )}
            
            <div className="flex gap-2">
              {isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 bg-primary/20 hover:bg-primary/30"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 bg-muted hover:bg-muted/80"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
                onClick={handleClose}
              >
                ×
              </Button>
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="text-sm text-foreground/80 bg-background/50 border border-primary/30 rounded px-2 py-1 w-full min-h-[100px]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="text-sm text-foreground/80">{editableContent}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeStar;
