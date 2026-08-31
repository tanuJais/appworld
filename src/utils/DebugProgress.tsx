// Add this to any screen to view progress data in console

import { useGame } from '../context/GameContext';

function DebugProgress() {
  const { userProgress, concepts } = useGame();
  
  // View progress in console
  console.log('=== USER PROGRESS ===');
  console.log('XP:', userProgress.totalXP);
  console.log('Level:', userProgress.level);
  console.log('Streak:', userProgress.streak);
  console.log('Concepts:', userProgress.concepts);
  
  console.log('=== CONCEPT MASTERY ===');
  concepts.forEach(concept => {
    console.log(`${concept.name}: ${concept.masteryPercentage}%`);
  });
  
  return null;
}

// Add to any screen temporarily:
// <DebugProgress />
