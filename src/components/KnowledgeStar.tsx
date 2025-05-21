
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // For title editing
import { Textarea } from "@/components/ui/textarea"; // For content editing
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pencil, Check, X } from "lucide-react"; // Added X for close
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
    <motion.div // Converted to motion.div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...position,
      }}
      className={cn(
        "knowledge-star star-glow absolute",
        colorClasses[color],
        isExpanded ? "z-50" : "z-10" // Ensure non-expanded stars are behind expanded ones
      )}
      onClick={handleStarClick}
      id={id}
      animate={{ scale: isExpanded ? 1.2 : 1 }} // Apply scale animation
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isExpanded && (
        <Card
          onClick={handlePopupClick}
          className={cn(
            "star-popup absolute w-72 md:w-96 animate-fade-in",
            popupClasses[color],
            isMobile ? "top-8 left-0" : "top-full mt-4 left-1/2 -translate-x-1/2"
          )}
        >
          <CardHeader className="flex-row items-start justify-between pb-3">
            <div className="flex-grow">
              {isEditing ? (
                <Input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="text-lg font-bold bg-transparent border-white/30 focus:border-primary h-9"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <CardTitle className="text-xl font-bold text-white leading-tight">{editableTitle}</CardTitle>
              )}
              {/* <CardDescription className="text-xs text-white/60">Last updated: Never</CardDescription> */}
            </div>
            <div className="flex gap-1 -mr-2 -mt-1">
              {isEditing ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-white"
                  onClick={handleSave}
                  aria-label="Save changes"
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  onClick={handleEdit}
                  aria-label="Edit star"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={handleClose}
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {isEditing ? (
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="text-sm bg-transparent border-white/30 focus:border-primary min-h-[120px] text-white/90"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm text-white/90 leading-relaxed">{editableContent}</p>
            )}
          </CardContent>
          {isExpanded && !isEditing && (
            <CardFooter className="p-0 pb-2 px-4">
              <motion.div
                className="h-1 rounded-full"
                style={{
                  background: `linear-gradient(to right, var(--${color}-glow), var(--${color}-glow-inner))`
                }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                onAnimationComplete={() => {
                  // Ensure it only closes if this star is still the active one and not editing
                  if (activeStarId === id && !isEditing) {
                     setActiveStarId(null);
                  }
                }}
              />
            </CardFooter>
          )}
        </Card>
      )}
    </motion.div>
  );
};

export default KnowledgeStar;
