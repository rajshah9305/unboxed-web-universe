
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute top-0 left-0 w-full z-40 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cosmic-pink to-cosmic-cyan"
            >
              Knowledge Galaxy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs md:text-sm text-muted-foreground"
            >
              Explore the universe of ideas
            </motion.p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="bg-muted/30 backdrop-blur-sm border-cosmic-pink"
              >
                How to Use
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-muted/80 backdrop-blur-md border-cosmic-cyan text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cosmic-pink to-cosmic-cyan">
                  How to Navigate the Galaxy
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Follow these instructions to explore the universe of ideas.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 text-sm">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Click and drag to move around the galaxy</li>
                  <li>Use mouse wheel or buttons to zoom in/out</li>
                  <li>Click on glowing stars to reveal knowledge</li>
                  <li>Click the reset button (↺) to return to the center</li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground/80">
                  Each star contains a unique piece of knowledge. Explore and learn!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Header;
