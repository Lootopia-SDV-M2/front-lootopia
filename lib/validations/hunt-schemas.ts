import { z } from "zod";
import type { HuntDifficulty } from "@/types";

/**
 * Schema for hunt step creation
 */
export const huntStepSchema = z.object({
  id: z.string(),
  order: z.number().min(1),
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "100 caractères maximum"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(500, "500 caractères maximum"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(5, "Minimum 5m").max(100, "Maximum 100m").default(20),
  clueText: z.string().max(200, "200 caractères maximum").optional(),
});

export type HuntStepFormData = z.infer<typeof huntStepSchema>;

/**
 * Schema for hunt reward creation
 */
export const rewardSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "100 caractères maximum"),
});

export type RewardFormData = z.infer<typeof rewardSchema>;

/**
 * Schema for hunt general info (Step 1)
 */
export const huntInfoSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  difficulty: z.enum(["easy", "medium", "hard", "expert"]),
  duration: z
    .string()
    .min(1, "La durée est requise")
    .regex(/^\d{2}:\d{2}$/, "Format invalide (ex: 01:30, 02:00)"),
  reward: z.number().min(10, "Minimum 10 XP").max(5000, "Maximum 5000 XP"),
  maxParticipants: z
    .number()
    .min(1, "Minimum 1 participant")
    .max(100, "Maximum 100 participants"),
  theme: z
    .enum(["history", "art", "nature", "urban", "mystery", "adventure"])
    .optional(),
});

export type HuntInfoFormData = z.infer<typeof huntInfoSchema>;

/**
 * Schema for complete hunt creation
 */
export const createHuntSchema = z.object({
  ...huntInfoSchema.shape,
  steps: z.array(huntStepSchema).min(2, "Au moins deux étapes sont requises"),
  rewards: z.array(rewardSchema).min(1, "Au moins un cadeau est requis"),
});

export type CreateHuntFormData = z.infer<typeof createHuntSchema>;

/**
 * Theme options for hunts
 */
export const huntThemes = [
  { value: "history", label: "Histoire & Patrimoine", icon: "🏛️" },
  { value: "art", label: "Art & Culture", icon: "🎨" },
  { value: "nature", label: "Nature & Environnement", icon: "🌿" },
  { value: "urban", label: "Urbain & Street Art", icon: "🏙️" },
  { value: "mystery", label: "Mystère & Énigmes", icon: "🔮" },
  { value: "adventure", label: "Aventure & Sport", icon: "⛰️" },
] as const;

/**
 * Difficulty options for hunts
 */
export const difficultyOptions: {
  value: HuntDifficulty;
  label: string;
  description: string;
}[] = [
  {
    value: "easy",
    label: "Facile",
    description: "Idéal pour les débutants et les familles",
  },
  {
    value: "medium",
    label: "Moyen",
    description: "Pour les chasseurs expérimentés",
  },
  {
    value: "hard",
    label: "Difficile",
    description: "Un défi pour les experts",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Réservé aux meilleurs chasseurs",
  },
];
