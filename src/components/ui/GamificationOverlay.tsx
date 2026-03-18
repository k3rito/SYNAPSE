'use client';

import React from 'react';
import { NeuralToastContainer } from "@/components/ui/NeuralToast";
import { LevelUpModal } from "@/components/ui/LevelUpModal";
import { useGamificationStore } from "@/store/useGamificationStore";

export function GamificationOverlay() {
  const { isLevelingUp, level, rank, confirmLevelUp } = useGamificationStore();

  return (
    <>
      <NeuralToastContainer />
      <LevelUpModal 
        isOpen={isLevelingUp} 
        level={level} 
        rank={rank} 
        onClose={confirmLevelUp} 
      />
    </>
  );
}
