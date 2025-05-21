
import React, { createContext, useContext, useState, useCallback } from 'react';

type KnowledgeStarContextType = {
  activeStarId: string | null;
  setActiveStarId: (id: string | null) => void;
};

const KnowledgeStarContext = createContext<KnowledgeStarContextType | undefined>(undefined);

export const KnowledgeStarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStarId, setActiveStarId] = useState<string | null>(null);

  const handleSetActiveStar = useCallback((id: string | null) => {
    setActiveStarId(id);
  }, []);

  return (
    <KnowledgeStarContext.Provider
      value={{
        activeStarId,
        setActiveStarId: handleSetActiveStar,
      }}
    >
      {children}
    </KnowledgeStarContext.Provider>
  );
};

export const useKnowledgeStar = () => {
  const context = useContext(KnowledgeStarContext);
  if (context === undefined) {
    throw new Error('useKnowledgeStar must be used within a KnowledgeStarProvider');
  }
  return context;
};
