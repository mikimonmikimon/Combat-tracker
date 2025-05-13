
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

// This schema defines the stats that are input in the form
const inputStatsSchema = z.object({
  health: z.coerce.number().min(1, "La salud debe ser al menos 1."),
  armor: z.coerce.number().min(0, "La armadura no puede ser negativa."),
  cosmos: z.coerce.number().min(0, "El cosmos no puede ser negativo."),
});

const setupFormSchema = z.object({
  player1Name: z.string().min(1, "El nombre del Jugador 1 es obligatorio."),
  player1Stats: inputStatsSchema,
  player2Name: z.string().min(1, "El nombre del Jugador 2 es obligatorio."),
  player2Stats: inputStatsSchema,
});

type SetupFormValues = z.infer<typeof setupFormSchema>;

// Define a type for the data passed to onSetupComplete
// It's the raw input stats plus name, before full CharacterStats construction
type PlayerSetupData = {
  name: string;
  health: number;
  armor: number;
  cosmos: number;
};

interface SetupFormProps {
  onSetupComplete: (player1Data: PlayerSetupData, player2Data: PlayerSetupData) => void;
}

export function SetupForm({ onSetupComplete }: SetupFormProps) {
  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      player1Name: "Jugador 1",
      player1Stats: { health: 100, armor: 50, cosmos: 50 },
      player2Name: "Jugador 2",
      player2Stats: { health: 100, armor: 50, cosmos: 50 },
    },
  });

  function onSubmit(data: SetupFormValues) {
    const player1Data: PlayerSetupData = {
      name: data.player1Name,
      ...data.player1Stats,
    };
    const player2Data: PlayerSetupData = {
      name: data.player2Name,
      ...data.player2Stats,
    };
    // onSetupComplete will handle creating full CharacterStats objects including max values
    onSetupComplete(player1Data, player2Data);
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary">Configuración de Personajes</CardTitle>
        <CardDescription className="text-center">
          Introduce las estadísticas iniciales para ambos combatientes cósmicos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Player 1 Stats */}
              <div className="space-y-4 p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><User className="w-6 h-6" /> Jugador 1</h3>
                <FormField
                  control={form.control}
                  name="player1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del Jugador 1" {...field} />
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
                      <FormLabel className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> Salud</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Salud Inicial" {...field} />
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
                      <FormLabel className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> Armadura</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Armadura Inicial" {...field} />
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
                        <Input type="number" placeholder="Cosmos Inicial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Player 2 Stats */}
              <div className="space-y-4 p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><UserRound className="w-6 h-6" /> Jugador 2</h3>
                <FormField
                  control={form.control}
                  name="player2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del Jugador 2" {...field} />
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
                      <FormLabel className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> Salud</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Salud Inicial" {...field} />
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
                      <FormLabel className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-400" /> Armadura</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Armadura Inicial" {...field} />
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
                        <Input type="number" placeholder="Cosmos Inicial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full text-lg">Iniciar Combate</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
