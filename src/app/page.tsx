
"use client";

import type { CharacterStats } from "@/types";
import React, { useState, useEffect } from "react";
import { SetupForm } from "@/components/setup-form";
import { CharacterCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, UserRound, Zap, Shield, Heart, Award, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GamePhase = "setup" | "combat" | "gameOver";
type StatKey = "health" | "armor" | "cosmos";
type ActionType = "damage" | "heal";

export default function HomePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [player1, setPlayer1] = useState<CharacterStats | null>(null);
  const [player2, setPlayer2] = useState<CharacterStats | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetupComplete = (p1Data: Omit<CharacterStats, 'id' | 'icon' | 'maxHealth' | 'maxCosmos' | 'maxArmor'> & {name: string}, p2Data: Omit<CharacterStats, 'id' | 'icon' | 'maxHealth' | 'maxCosmos' | 'maxArmor'> & {name: string}) => {
    setPlayer1({
      ...p1Data,
      id: 'player1',
      icon: User,
      maxHealth: p1Data.health,
      maxCosmos: p1Data.cosmos,
      maxArmor: p1Data.armor, // Set maxArmor from initial armor
    });
    setPlayer2({
      ...p2Data,
      id: 'player2',
      icon: UserRound,
      maxHealth: p2Data.health,
      maxCosmos: p2Data.cosmos,
      maxArmor: p2Data.armor, // Set maxArmor from initial armor
    });
    setGamePhase("combat");
    setWinner(null);
    toast({
      title: "¡Combate Iniciado!",
      description: "¡Que el cosmos favorezca a los audaces!",
    });
  };

  const handleStatChange = (
    playerId: string,
    stat: StatKey,
    type: ActionType,
    value: number
  ) => {
    const playerToUpdate = playerId === player1?.id ? player1 : player2;
    const setPlayer = playerId === player1?.id ? setPlayer1 : setPlayer2;
    const otherPlayer = playerId === player1?.id ? player2 : player1;

    if (!playerToUpdate || !setPlayer) return;

    let newValue = playerToUpdate[stat];
    if (type === "damage") {
      newValue -= value;
    } else {
      newValue += value;
    }

    // Clamp values
    if (stat === "health") {
      newValue = Math.max(0, Math.min(newValue, playerToUpdate.maxHealth));
    } else if (stat === "cosmos") {
      newValue = Math.max(0, Math.min(newValue, playerToUpdate.maxCosmos));
    } else if (stat === "armor") {
      // Armor is clamped between 0 and its maxArmor value.
      newValue = Math.max(0, Math.min(newValue, playerToUpdate.maxArmor));
    }
    
    const updatedPlayer = { ...playerToUpdate, [stat]: newValue };
    setPlayer(updatedPlayer);

    // Check for winner if health changed
    if (stat === "health" && newValue <= 0) {
      if (otherPlayer) { // Ensure otherPlayer is defined
        setWinner(otherPlayer.name);
        setGamePhase("gameOver");
        toast({
          title: "¡Combate Terminado!",
          description: `¡${otherPlayer.name} es victorioso!`,
          variant: "default",
          duration: 5000,
        });
      }
    }
  };

  const resetGame = () => {
    setGamePhase("setup");
    setPlayer1(null);
    setPlayer2(null);
    setWinner(null);
    toast({
      title: "Juego Reiniciado",
      description: "Configura tus combatientes de nuevo.",
    });
  };

  if (gamePhase === "setup") {
    return <SetupForm onSetupComplete={handleSetupComplete} />;
  }

  if (!player1 || !player2) {
    // Should not happen if gamePhase is not 'setup', but as a fallback:
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-destructive">Error: Faltan datos del jugador.</p>
        <Button onClick={resetGame} className="mt-4">Reiniciar Juego</Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6">
      {/* Title removed as per request */}
      {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary tracking-tight">
        Rastreador de Combate Cósmico
      </h1> */}

      {winner && gamePhase === "gameOver" && (
        <Alert variant="default" className="max-w-md bg-accent/20 border-accent shadow-lg mt-4"> {/* Added mt-4 for spacing if title is removed */}
          <Award className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          <AlertTitle className="text-xl sm:text-2xl font-bold text-accent">¡{winner} Gana!</AlertTitle>
          <AlertDescription className="text-base sm:text-lg">
            La batalla cósmica ha concluido. ¡Felicidades, {winner}!
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6 max-w-md">
        <CharacterCard
          character={player1}
          onStatChange={handleStatChange}
          isGameOver={gamePhase === "gameOver"}
        />
        <CharacterCard
          character={player2}
          onStatChange={handleStatChange}
          isGameOver={gamePhase === "gameOver"}
        />
      </div>

      <Button 
        onClick={resetGame} 
        variant="outline" 
        className="mt-6 sm:mt-8 px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base"
      >
        <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Reiniciar Combate
      </Button>
    </div>
  );
}
