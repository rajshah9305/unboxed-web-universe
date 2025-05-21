
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

  // Define star colors and glow effects based on type
  const colorClasses = {
    yellow: "bg-cosmic-yellow star-glow-yellow",
    pink: "bg-cosmic-pink star-glow-pink",
    cyan: "bg-cosmic-cyan star-glow-cyan",
  };
  
  const popupClasses = {
    yellow: "star-popup-yellow",
    pink: "star-popup-pink",
    cyan: "star-popup-cyan",
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
            "absolute w-72 md:w-96 star-popup animate-fade-in",
            popupClasses[color],
            isMobile ? "top-8 left-0" : "top-full mt-4 left-1/2 -translate-x-1/2"
          )}
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            {isEditing ? (
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-lg font-bold bg-background/30 border border-white/20 rounded px-2 py-1 w-full mr-2 focus:outline-none focus:ring-1 focus:ring-white/30"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-bold text-white">{editableTitle}</h3>
            )}
            
            <div className="flex gap-2">
              {isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 bg-primary/20 hover:bg-primary/30 text-white"
                  onClick={handleSave}
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 bg-white/10 hover:bg-white/20 text-white"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 bg-white/10 hover:bg-white/20 text-white"
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
              className="text-sm bg-background/30 border border-white/20 rounded px-3 py-2 w-full min-h-[120px] focus:outline-none focus:ring-1 focus:ring-white/30 text-white"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="text-sm text-white/90 leading-relaxed">{editableContent}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeStar;
