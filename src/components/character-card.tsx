
"use client";

import type { CharacterStats } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    if (animationState[stat] === 'heal') return 'bg-emerald-500 text-white'; // Using Tailwind direct color for simplicity
    return '';
  };

  const StatDisplay: React.FC<{
    icon: React.ElementType;
    label: string;
    value: number;
    maxValue?: number;
    statKey: StatKey;
    iconColor?: string;
  }> = ({ icon: Icon, label, value, maxValue, statKey, iconColor }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={`${character.id}-${statKey}-input`} className="flex items-center text-lg">
          <Icon className={cn("w-5 h-5 mr-2", iconColor)} /> {label}
        </Label>
        <span className={cn("text-lg font-semibold stat-value-display", getStatDisplayClass(statKey))}>
          {value}{maxValue !== undefined ? ` / ${maxValue}` : ""}
        </span>
      </div>
      {maxValue !== undefined && value >= 0 && (
        <Progress value={(value / maxValue) * 100} className="h-3 [&>div]:bg-primary" />
      )}
      {!isGameOver && (
        <div className="flex flex-col space-y-2 pt-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 sm:pt-1">
          <Input
            id={`${character.id}-${statKey}-input`}
            type="number"
            value={actionValues[statKey]}
            onChange={(e) => handleInputChange(statKey, e.target.value)}
            className="w-full sm:w-20 h-9 text-sm"
            min="1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(statKey, "damage")}
            aria-label={`Dañar ${label}`}
            className="w-full sm:w-auto hover:bg-destructive hover:text-destructive-foreground"
          >
            <MinusCircle className="w-4 h-4 mr-1" /> Dañar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(statKey, "heal")}
            aria-label={`Curar ${label}`}
            className="w-full sm:w-auto hover:bg-emerald-500 hover:text-white"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Curar
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <CharacterIcon className="w-8 h-8" /> {character.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatDisplay icon={Heart} label="Salud" value={character.health} maxValue={character.maxHealth} statKey="health" iconColor="text-red-400" />
        <Separator />
        <StatDisplay icon={Shield} label="Armadura" value={character.armor} statKey="armor" iconColor="text-blue-400" />
        <Separator />
        <StatDisplay icon={Sparkles} label="Cosmos" value={character.cosmos} maxValue={character.maxCosmos} statKey="cosmos" iconColor="text-yellow-400" />
      </CardContent>
      {isGameOver && (
         <CardFooter className="pt-4">
           <p className="text-center w-full text-muted-foreground text-lg">Acciones de combate deshabilitadas.</p>
         </CardFooter>
      )}
    </Card>
  );
}
