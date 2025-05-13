"use client";

import type { CharacterStats } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, UserRound, Sparkles, Shield, Heart } from "lucide-react";

const statsSchema = z.object({
  health: z.coerce.number().min(1, "Health must be at least 1."),
  armor: z.coerce.number().min(0, "Armor cannot be negative."),
  cosmos: z.coerce.number().min(0, "Cosmos cannot be negative."),
});

const setupFormSchema = z.object({
  player1Name: z.string().min(1, "Player 1 name is required."),
  player1Stats: statsSchema,
  player2Name: z.string().min(1, "Player 2 name is required."),
  player2Stats: statsSchema,
});

type SetupFormValues = z.infer<typeof setupFormSchema>;

interface SetupFormProps {
  onSetupComplete: (player1Data: CharacterStats, player2Data: CharacterStats) => void;
}

export function SetupForm({ onSetupComplete }: SetupFormProps) {
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      player1Name: "Player 1",
      player1Stats: { health: 100, armor: 50, cosmos: 50 },
      player2Name: "Player 2",
      player2Stats: { health: 100, armor: 50, cosmos: 50 },
    },
  });

  function onSubmit(data: SetupFormValues) {
    const player1: CharacterStats = {
      id: 'player1',
      name: data.player1Name,
      ...data.player1Stats,
      maxHealth: data.player1Stats.health,
      maxCosmos: data.player1Stats.cosmos,
      icon: User,
    };
    const player2: CharacterStats = {
      id: 'player2',
      name: data.player2Name,
      ...data.player2Stats,
      maxHealth: data.player2Stats.health,
      maxCosmos: data.player2Stats.cosmos,
      icon: UserRound,
    };
    onSetupComplete(player1, player2);
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Character Setup</CardTitle>
        <CardDescription className="text-center">
          Enter the initial statistics for both cosmic combatants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Player 1 Stats */}
              <div className="space-y-4 p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><User className="w-6 h-6" /> Player 1</h3>
                <FormField
                  control={form.control}
                  name="player1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Player 1 Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> Health</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Health" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.armor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> Armor</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Armor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.cosmos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-yellow-400" /> Cosmos</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Cosmos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Player 2 Stats */}
              <div className="space-y-4 p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><UserRound className="w-6 h-6" /> Player 2</h3>
                <FormField
                  control={form.control}
                  name="player2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Player 2 Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> Health</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Health" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.armor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> Armor</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Armor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.cosmos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-yellow-400" /> Cosmos</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Initial Cosmos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full text-lg py-6">Start Combat</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
