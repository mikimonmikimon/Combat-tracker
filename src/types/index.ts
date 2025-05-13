export interface CharacterStats {
  id: string; // 'player1' or 'player2'
  name: string;
  health: number;
  armor: number;
  cosmos: number;
  maxHealth: number;
  maxCosmos: number;
  maxArmor: number; // Added maxArmor
  icon?: React.ComponentType<{ className?: string }>;
}
