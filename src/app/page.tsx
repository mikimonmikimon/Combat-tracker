
"use client";

import type { CharacterStats } from "@/types";
import React, { useState, useEffect } from "react";
import { SetupForm } from "@/components/setup-form";
import { CharacterCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, UserRound, Award, RotateCcw } from "lucide-react";
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

  // Load state from localStorage on component mount
  useEffect(() => {
    const storedPlayer1Data = localStorage.getItem('player1');
    const storedPlayer2Data = localStorage.getItem('player2');
    const storedGamePhase = localStorage.getItem('gamePhase');
    const storedWinner = localStorage.getItem('winner');

    if (storedPlayer1Data) {
      try {
        const parsedPlayer1 = JSON.parse(storedPlayer1Data) as Omit<CharacterStats, 'icon'>;
        setPlayer1({ ...parsedPlayer1, icon: User }); // Re-assign icon component
      } catch (error) {
        console.error("Error parsing player1 from localStorage", error);
        localStorage.removeItem('player1');
      }
    }
    if (storedPlayer2Data) {
      try {
        const parsedPlayer2 = JSON.parse(storedPlayer2Data) as Omit<CharacterStats, 'icon'>;
        setPlayer2({ ...parsedPlayer2, icon: UserRound }); // Re-assign icon component
      } catch (error) {
        console.error("Error parsing player2 from localStorage", error);
        localStorage.removeItem('player2');
      }
    }
    if (storedGamePhase) {
      setGamePhase(storedGamePhase as GamePhase);
    }
    if (storedWinner) {
      setWinner(storedWinner);
    }
  }, []);

  // Save state to localStorage whenever relevant state variables change
  useEffect(() => {
    if (player1) {
      localStorage.setItem('player1', JSON.stringify(player1));
    } else {
      localStorage.removeItem('player1');
    }
  }, [player1]);

  useEffect(() => {
    if (player2) {
      localStorage.setItem('player2', JSON.stringify(player2));
    } else {
      localStorage.removeItem('player2');
    }
  }, [player2]);

  useEffect(() => {
    localStorage.setItem('gamePhase', gamePhase);
  }, [gamePhase]);
  
  useEffect(() => {
    if (winner) {
      localStorage.setItem('winner', winner);
    } else {
      localStorage.removeItem('winner');
    }
  }, [winner]);


  const handleSetupComplete = (p1Data: Omit<CharacterStats, 'id' | 'icon' | 'maxHealth' | 'maxCosmos' | 'maxArmor'> & {name: string}, p2Data: Omit<CharacterStats, 'id' | 'icon' | 'maxHealth' | 'maxCosmos' | 'maxArmor'> & {name: string}) => {
    setPlayer1({
      ...p1Data,
      id: 'player1',
      icon: User,
      maxHealth: p1Data.health,
      maxCosmos: p1Data.cosmos,
      maxArmor: p1Data.armor,
    });
    setPlayer2({
      ...p2Data,
      id: 'player2',
      icon: UserRound,
      maxHealth: p2Data.health,
      maxCosmos: p2Data.cosmos,
      maxArmor: p2Data.armor,
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
      newValue = Math.max(0, Math.min(newValue, playerToUpdate.maxArmor));
    }
    
    const updatedPlayer = { ...playerToUpdate, [stat]: newValue };
    setPlayer(updatedPlayer);

    if (stat === "health" && newValue <= 0) {
      if (otherPlayer) { 
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
    localStorage.removeItem('player1');
    localStorage.removeItem('player2');
    localStorage.removeItem('gamePhase');
    localStorage.removeItem('winner');
    toast({
      title: "Juego Reiniciado",
      description: "Configura tus combatientes de nuevo.",
    });
  };

  if (gamePhase === "setup") {
    return <SetupForm onSetupComplete={handleSetupComplete} />;
  }

  if (!player1 || !player2) {
    // Fallback, should ideally not be reached if localStorage logic is sound
    // or if initial setup is always forced.
    // If localStorage is corrupted or empty, and phase is not setup, this might be hit.
    // We can force a reset here or show an error.
    // Forcing reset to setup might be a better UX than showing an error.
    if(typeof window !== 'undefined'){ // ensure localStorage is available
        localStorage.removeItem('player1');
        localStorage.removeItem('player2');
        localStorage.removeItem('winner');
        localStorage.setItem('gamePhase', 'setup'); // Force back to setup
    }
    // To prevent flashing the error, we can briefly show a loading or redirecting state
    // For simplicity, just resetting the state and letting the next render cycle handle it.
    if (gamePhase !== "setup") setGamePhase("setup"); // Trigger re-render to setup form
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <p className="text-lg">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6">
      {winner && gamePhase === "gameOver" && (
        <Alert variant="default" className="max-w-md bg-accent/20 border-accent shadow-lg mt-4">
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

