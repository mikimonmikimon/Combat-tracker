
"use client";

import type { CharacterStats } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Sparkles, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StatKey = "health" | "armor" | "cosmos";
type ActionType = "damage" | "heal";

interface CharacterCardProps {
  character: CharacterStats;
  onStatChange: (playerId: string, stat: StatKey, type: ActionType, value: number) => void;
  isGameOver: boolean;
}

export function CharacterCard({ character, onStatChange, isGameOver }: CharacterCardProps) {
  const [actionValues, setActionValues] = useState<Record<StatKey, string>>({
    health: "10",
    armor: "10",
    cosmos: "10",
  });

  const [animationState, setAnimationState] = useState<Partial<Record<StatKey, ActionType | null>>>({});
  const prevStatsRef = useRef<CharacterStats>(character);

  useEffect(() => {
    const newAnimations: Partial<Record<StatKey, ActionType | null>> = {};
    (Object.keys(character) as Array<keyof CharacterStats>).forEach(key => {
      if (key === 'health' || key === 'armor' || key === 'cosmos') {
        if (character[key] < prevStatsRef.current[key]) {
          newAnimations[key] = 'damage';
        } else if (character[key] > prevStatsRef.current[key]) {
          newAnimations[key] = 'heal';
        }
      }
    });

    if (Object.keys(newAnimations).length > 0) {
      setAnimationState(newAnimations);
      const timer = setTimeout(() => setAnimationState({}), 500); // Animation duration
      return () => clearTimeout(timer);
    }
    prevStatsRef.current = character;
  }, [character]);


  const handleAction = (stat: StatKey, type: ActionType) => {
    const value = parseInt(actionValues[stat], 10);
    if (!isNaN(value) && value > 0) {
      onStatChange(character.id, stat, type, value);
    }
  };

  const handleInputChange = (stat: StatKey, value: string) => {
    setActionValues(prev => ({ ...prev, [stat]: value }));
  };

  const CharacterIcon = character.icon || Sparkles;

  const getStatDisplayClass = (stat: StatKey) => {
    if (animationState[stat] === 'damage') return 'bg-destructive text-destructive-foreground';
    if (animationState[stat] === 'heal') return 'bg-emerald-500 text-white'; 
    return '';
  };

  return (
    <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="pb-2 pt-3"> {/* Reduced padding */}
        <CardTitle className="text-xl sm:text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <CharacterIcon className="w-7 h-7" /> {character.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-2 sm:px-4 sm:py-3"> {/* Reduced padding and space */}
        {/* Stat Labels Row */}
        <div className="flex justify-around text-center">
          <Label className="flex-1 flex items-center justify-center text-xs sm:text-sm">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-400" />Salud
          </Label>
          <Label className="flex-1 flex items-center justify-center text-xs sm:text-sm">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-400" />Armadura
          </Label>
          <Label className="flex-1 flex items-center justify-center text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />Cosmos
          </Label>
        </div>

        {/* Stat Values & Progress Bars Row */}
        <div className="flex justify-around text-center items-start space-x-1 sm:space-x-2">
          {/* Health Value & Progress */}
          <div className="flex-1 flex flex-col items-center">
            <span className={cn("text-sm sm:text-base font-semibold stat-value-display px-1 py-0.5", getStatDisplayClass('health'))}>
              {character.health}/{character.maxHealth}
            </span>
            <Progress value={(character.health / character.maxHealth) * 100} className="h-2 w-full mt-1 [&>div]:bg-primary" />
          </div>
          {/* Armor Value & Progress */}
          <div className="flex-1 flex flex-col items-center">
            <span className={cn("text-sm sm:text-base font-semibold stat-value-display px-1 py-0.5", getStatDisplayClass('armor'))}>
              {character.armor}/{character.maxArmor}
            </span>
            <Progress value={character.maxArmor > 0 ? (character.armor / character.maxArmor) * 100 : 0} className="h-2 w-full mt-1 [&>div]:bg-primary" />
          </div>
          {/* Cosmos Value & Progress */}
          <div className="flex-1 flex flex-col items-center">
            <span className={cn("text-sm sm:text-base font-semibold stat-value-display px-1 py-0.5", getStatDisplayClass('cosmos'))}>
              {character.cosmos}/{character.maxCosmos}
            </span>
            <Progress value={(character.cosmos / character.maxCosmos) * 100} className="h-2 w-full mt-1 [&>div]:bg-primary" />
          </div>
        </div>

        {!isGameOver && (
          <>
            {/* Input Fields Row */}
            <div className="flex justify-around items-center space-x-1 sm:space-x-2 pt-1">
              <Input
                id={`${character.id}-health-input`}
                type="number"
                value={actionValues.health}
                onChange={(e) => handleInputChange('health', e.target.value)}
                className="w-full text-xs h-7 px-1 flex-1"
                min="1"
                aria-label={`Valor para Salud de ${character.name}`}
              />
              <Input
                id={`${character.id}-armor-input`}
                type="number"
                value={actionValues.armor}
                onChange={(e) => handleInputChange('armor', e.target.value)}
                className="w-full text-xs h-7 px-1 flex-1"
                min="1"
                aria-label={`Valor para Armadura de ${character.name}`}
              />
              <Input
                id={`${character.id}-cosmos-input`}
                type="number"
                value={actionValues.cosmos}
                onChange={(e) => handleInputChange('cosmos', e.target.value)}
                className="w-full text-xs h-7 px-1 flex-1"
                min="1"
                aria-label={`Valor para Cosmos de ${character.name}`}
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex justify-around items-stretch space-x-1 sm:space-x-2 pt-1">
              {/* Health Buttons */}
              <div className="flex-1 flex flex-col space-y-1">
                <Button variant="outline" size="sm" onClick={() => handleAction('health', "damage")} aria-label={`Dañar Salud de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-destructive hover:text-destructive-foreground">
                  <MinusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Dañar</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('health', "heal")} aria-label={`Curar Salud de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-emerald-500 hover:text-white">
                  <PlusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Curar</span>
                </Button>
              </div>
              {/* Armor Buttons */}
              <div className="flex-1 flex flex-col space-y-1">
                <Button variant="outline" size="sm" onClick={() => handleAction('armor', "damage")} aria-label={`Dañar Armadura de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-destructive hover:text-destructive-foreground">
                  <MinusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Dañar</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('armor', "heal")} aria-label={`Curar Armadura de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-emerald-500 hover:text-white">
                  <PlusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Curar</span>
                </Button>
              </div>
              {/* Cosmos Buttons */}
              <div className="flex-1 flex flex-col space-y-1">
                <Button variant="outline" size="sm" onClick={() => handleAction('cosmos', "damage")} aria-label={`Dañar Cosmos de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-destructive hover:text-destructive-foreground">
                  <MinusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Dañar</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAction('cosmos', "heal")} aria-label={`Curar Cosmos de ${character.name}`} className="text-xs p-1 h-auto flex-1 hover:bg-emerald-500 hover:text-white">
                  <PlusCircle className="w-3 h-3 sm:mr-1" /> <span className="hidden sm:inline">Curar</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {isGameOver && (
         <CardFooter className="pt-2 pb-3 px-3"> {/* Reduced padding */}
           <p className="text-center w-full text-muted-foreground text-xs sm:text-sm">Acciones de combate deshabilitadas.</p>
         </CardFooter>
      )}
    </Card>
  );
}
