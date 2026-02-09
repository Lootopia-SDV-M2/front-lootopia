import { create } from "zustand";
import type { HuntDifficulty } from "@/types";
import type { HuntStepFormData } from "@/lib/validations";
import { huntApi } from "@/lib/api/hunt-api";
import type { CreateHuntData } from "@/lib/api/hunt-api";

export interface RewardDraft {
  id: string;
  name: string;
  imageFile: File | null;
  imagePreview: string | null;
}

interface HuntDraft {
  // Step 1: General info
  title: string;
  description: string;
  difficulty: HuntDifficulty | null;
  duration: string;
  reward: number;
  maxParticipants: number;
  theme: string | null;

  // Step 2: Map points
  steps: HuntStepFormData[];

  // Step 3: Rewards
  rewards: RewardDraft[];
}

interface CreateHuntState {
  /** Current step of the wizard (1, 2, or 3) */
  currentStep: 1 | 2 | 3;
  /** Hunt draft data */
  draft: HuntDraft;
  /** Whether the form is being submitted */
  isSubmitting: boolean;
  /** Submission error if any */
  error: string | null;
  /** Success state */
  isSuccess: boolean;

  // Actions
  setCurrentStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (data: Partial<HuntDraft>) => void;
  addStep: (step: Omit<HuntStepFormData, "order">) => void;
  updateStep: (id: string, data: Partial<HuntStepFormData>) => void;
  removeStep: (id: string) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  addReward: () => void;
  removeReward: (id: string) => void;
  updateReward: (id: string, data: Partial<RewardDraft>) => void;
  resetForm: () => void;
  submitHunt: () => Promise<boolean>;
}

const initialDraft: HuntDraft = {
  title: "",
  description: "",
  difficulty: null,
  duration: "",
  reward: 100,
  maxParticipants: 10,
  theme: null,
  steps: [],
  rewards: [],
};

/**
 * Store for managing hunt creation wizard state.
 */
export const useCreateHuntStore = create<CreateHuntState>((set, get) => ({
  currentStep: 1,
  draft: { ...initialDraft },
  isSubmitting: false,
  error: null,
  isSuccess: false,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: (currentStep + 1) as 1 | 2 | 3 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as 1 | 2 | 3 });
    }
  },

  updateDraft: (data) => {
    const { draft } = get();
    set({ draft: { ...draft, ...data } });
  },

  addStep: (stepData) => {
    const { draft } = get();
    const newStep: HuntStepFormData = {
      id: stepData.id,
      order: draft.steps.length + 1,
      title: stepData.title || `Étape ${draft.steps.length + 1}`,
      description: stepData.description || "",
      latitude: stepData.latitude,
      longitude: stepData.longitude,
      radius: stepData.radius || 20,
      clueText: stepData.clueText,
    };

    set({
      draft: {
        ...draft,
        steps: [...draft.steps, newStep],
      },
    });
  },

  updateStep: (id, data) => {
    const { draft } = get();
    set({
      draft: {
        ...draft,
        steps: draft.steps.map((step) =>
          step.id === id ? { ...step, ...data } : step
        ),
      },
    });
  },

  removeStep: (id) => {
    const { draft } = get();
    const filteredSteps = draft.steps.filter((step) => step.id !== id);
    const reorderedSteps = filteredSteps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    set({
      draft: {
        ...draft,
        steps: reorderedSteps,
      },
    });
  },

  reorderSteps: (fromIndex, toIndex) => {
    const { draft } = get();
    const steps = [...draft.steps];
    const [removed] = steps.splice(fromIndex, 1);
    steps.splice(toIndex, 0, removed);
    const reorderedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));
    set({
      draft: {
        ...draft,
        steps: reorderedSteps,
      },
    });
  },

  addReward: () => {
    const { draft } = get();
    const newReward: RewardDraft = {
      id: `reward-${Date.now()}`,
      name: "",
      imageFile: null,
      imagePreview: null,
    };
    set({
      draft: {
        ...draft,
        rewards: [...draft.rewards, newReward],
      },
    });
  },

  removeReward: (id) => {
    const { draft } = get();
    set({
      draft: {
        ...draft,
        rewards: draft.rewards.filter((r) => r.id !== id),
      },
    });
  },

  updateReward: (id, data) => {
    const { draft } = get();
    set({
      draft: {
        ...draft,
        rewards: draft.rewards.map((r) =>
          r.id === id ? { ...r, ...data } : r
        ),
      },
    });
  },

  resetForm: () => {
    set({
      currentStep: 1,
      draft: { ...initialDraft, steps: [], rewards: [] },
      isSubmitting: false,
      error: null,
      isSuccess: false,
    });
  },

  submitHunt: async () => {
    const { draft } = get();
    set({ isSubmitting: true, error: null });

    try {
      // Validate minimum requirements
      if (!draft.title || !draft.description || !draft.difficulty) {
        throw new Error("Informations générales incomplètes");
      }
      if (draft.steps.length < 2) {
        throw new Error("Au moins deux étapes sont requises");
      }
      if (draft.rewards.length !== draft.maxParticipants) {
        throw new Error(
          `Le nombre de cadeaux (${draft.rewards.length}) doit correspondre au nombre de participants max (${draft.maxParticipants})`
        );
      }

      const huntData: CreateHuntData = {
        title: draft.title,
        description: draft.description,
        difficulty: draft.difficulty,
        duration: draft.duration,
        theme: draft.theme || "",
        maxParticipants: draft.maxParticipants,
        steps: draft.steps.map((s, index) => ({
          orderIndex: index,
          title: s.title,
          description: s.description,
          latitude: s.latitude,
          longitude: s.longitude,
          radius: s.radius,
        })),
        rewards: draft.rewards.map((r) => ({
          name: r.name,
        })),
      };

      const rewardImages = draft.rewards
        .map((r) => r.imageFile)
        .filter((f): f is File => f !== null);

      await huntApi.createHunt(huntData, rewardImages);

      set({ isSubmitting: false, isSuccess: true });
      return true;
    } catch (error) {
      set({
        isSubmitting: false,
        error:
          error instanceof Error ? error.message : "Erreur lors de la création",
      });
      return false;
    }
  },
}));
