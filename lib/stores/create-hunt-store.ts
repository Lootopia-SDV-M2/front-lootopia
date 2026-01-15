import { create } from "zustand";
import type { HuntDifficulty } from "@/types";
import type { HuntStepFormData } from "@/lib/validations";

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
}

interface CreateHuntState {
  /** Current step of the wizard (1 or 2) */
  currentStep: number;
  /** Hunt draft data */
  draft: HuntDraft;
  /** Whether the form is being submitted */
  isSubmitting: boolean;
  /** Submission error if any */
  error: string | null;
  /** Success state */
  isSuccess: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (data: Partial<HuntDraft>) => void;
  addStep: (step: Omit<HuntStepFormData, "order">) => void;
  updateStep: (id: string, data: Partial<HuntStepFormData>) => void;
  removeStep: (id: string) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
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
    if (currentStep < 2) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateDraft: (data) => {
    const { draft } = get();
    set({ draft: { ...draft, ...data } });
  },

  addStep: (stepData) => {
    const { draft } = get();
    const newStep: HuntStepFormData = {
      id: stepData.id, // Use the provided ID
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
    // Reorder remaining steps
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
    // Update order numbers
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

  resetForm: () => {
    set({
      currentStep: 1,
      draft: { ...initialDraft },
      isSubmitting: false,
      error: null,
      isSuccess: false,
    });
  },

  submitHunt: async () => {
    const { draft } = get();
    set({ isSubmitting: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate minimum requirements
      if (!draft.title || !draft.description || !draft.difficulty) {
        throw new Error("Informations générales incomplètes");
      }
      if (draft.steps.length < 1) {
        throw new Error("Au moins une étape est requise");
      }

      console.log("Hunt created:", draft);
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
