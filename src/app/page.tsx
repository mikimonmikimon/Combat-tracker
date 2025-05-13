
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

const initialPlayerStats: Omit<CharacterStats, 'id' | 'name' | 'icon'> = {
  health: 0,
  armor: 0,
  cosmos: 0,
  maxHealth: 0,
  maxCosmos: 0,
};

export default function HomePage() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [player1, setPlayer1] = useState<CharacterStats | null>(null);
  const [player2, setPlayer2] = useState<CharacterStats | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetupComplete = (p1Data: CharacterStats, p2Data: CharacterStats) => {
    setPlayer1(p1Data);
    setPlayer2(p2Data);
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
      newValue = Math.max(0, newValue); // Armor doesn't go below 0
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
    <div className="w-full flex flex-col items-center space-y-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary tracking-tight">
        Rastreador de Combate Cósmico
      </h1>

      {winner && gamePhase === "gameOver" && (
        <Alert variant="default" className="max-w-md bg-accent/20 border-accent shadow-lg">
          <Award className="h-6 w-6 text-accent" />
          <AlertTitle className="text-2xl font-bold text-accent">¡{winner} Gana!</AlertTitle>
          <AlertDescription className="text-lg">
            La batalla cósmica ha concluido. ¡Felicidades, {winner}!
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full grid grid-cols-1 gap-8 justify-items-center max-w-md">
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
        className="mt-8 px-6 py-3 text-base sm:px-8 sm:py-3 sm:text-lg"
      >
        <RotateCcw className="mr-2 h-5 w-5" /> Reiniciar Combate
      </Button>
    </div>
  );
}
