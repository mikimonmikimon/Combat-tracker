
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
      player1Stats: { health: 240, armor: 300, cosmos: 480 },
      player2Name: "Jugador 2",
      player2Stats: { health: 240, armor: 300, cosmos: 480 },
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
    <Card className="w-full max-w-lg shadow-xl"> {/* Reduced max-width from max-w-2xl to max-w-lg */}
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary">Configuración de Personajes</CardTitle>
        <CardDescription className="text-center">
          Introduce las estadísticas iniciales para ambos combatientes cósmicos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"> {/* Grid for side-by-side player setup */}
              {/* Player 1 Stats */}
              <div className="space-y-3 p-3 sm:p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><User className="w-5 h-5 sm:w-6 sm:h-6" /> {form.watch("player1Name") || "Jugador 1"}</h3>
                <FormField
                  control={form.control}
                  name="player1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del Jugador 1" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" /> Salud</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Salud Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.armor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" /> Armadura</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Armadura Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player1Stats.cosmos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> Cosmos</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Cosmos Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Player 2 Stats */}
              <div className="space-y-3 p-3 sm:p-4 border border-border rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-center text-accent flex items-center justify-center gap-2"><UserRound className="w-5 h-5 sm:w-6 sm:h-6" /> {form.watch("player2Name") || "Jugador 2"}</h3>
                <FormField
                  control={form.control}
                  name="player2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del Jugador 2" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" /> Salud</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Salud Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.armor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" /> Armadura</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Armadura Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="player2Stats.cosmos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1 text-xs sm:text-sm"><Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> Cosmos</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Cosmos Inicial" {...field} className="text-sm h-9"/>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full text-base sm:text-lg mt-6">Iniciar Combate</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

