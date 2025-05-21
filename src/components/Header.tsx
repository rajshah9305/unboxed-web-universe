
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="absolute top-0 left-0 w-full z-40 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cosmic-pink to-cosmic-cyan">
              Knowledge Galaxy
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Explore the universe of ideas
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="bg-muted/30 backdrop-blur-sm border-muted"
            onClick={() => setIsInfoVisible(!isInfoVisible)}
          >
            {isInfoVisible ? "Hide Info" : "How to Use"}
          </Button>
        </div>
      </div>
      
      {isInfoVisible && (
        <div className="mt-4 bg-muted/60 backdrop-blur-md p-4 rounded-lg shadow-lg max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-lg font-semibold mb-2">How to Navigate:</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Click and drag to move around the galaxy</li>
            <li>Use mouse wheel or buttons to zoom in/out</li>
            <li>Click on glowing stars to reveal knowledge</li>
            <li>Click the reset button (↺) to return to the center</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Each star contains a unique piece of knowledge. Explore and learn!
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
