import { create } from "zustand";
import type { GeoPosition } from "@/types";

interface GeolocationState {
  /** Current user position */
  position: GeoPosition | null;
  /** Whether geolocation is being fetched */
  isLoading: boolean;
  /** Error message if geolocation failed */
  error: string | null;
  /** Whether user has granted permission */
  hasPermission: boolean | null;
  /** Internal: active watch ID */
  _watchId: number | null;
  /** Update user position */
  setPosition: (position: GeoPosition) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Set permission status */
  setPermission: (granted: boolean) => void;
  /** Request geolocation from browser */
  requestGeolocation: () => Promise<void>;
  /** Start watching position changes */
  watchPosition: () => number | null;
  /** Stop watching position */
  clearWatch: (watchId: number) => void;
}

/**
 * Geolocation store for managing user position.
 * Uses the browser's Geolocation API.
 */
export const useGeolocationStore = create<GeolocationState>((set, get) => ({
  position: null,
  isLoading: false,
  error: null,
  hasPermission: null,
  _watchId: null,

  setPosition: (position) => set({ position, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setPermission: (granted) => set({ hasPermission: granted }),

  requestGeolocation: async () => {
    if (!navigator.geolocation) {
      set({
        error: "La géolocalisation n'est pas supportée par votre navigateur",
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      set({
        position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        },
        isLoading: false,
        hasPermission: true,
        error: null,
      });
    } catch (error) {
      const geoError = error as GeolocationPositionError;
      let errorMessage = "Impossible de récupérer votre position";

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = "Vous avez refusé l'accès à votre position";
          set({ hasPermission: false });
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Position indisponible";
          break;
        case geoError.TIMEOUT:
          errorMessage = "Délai d'attente dépassé";
          break;
      }

      set({ error: errorMessage, isLoading: false });
    }
  },

  watchPosition: () => {
    if (!navigator.geolocation) {
      set({ error: "La géolocalisation n'est pas supportée" });
      return null;
    }

    const existing = get()._watchId;
    if (existing !== null) {
      navigator.geolocation.clearWatch(existing);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        set({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          hasPermission: true,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "Erreur de géolocalisation";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Accès à la position refusé";
          set({ hasPermission: false });
        }
        set({ error: errorMessage });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    set({ _watchId: watchId });
    return watchId;
  },

  clearWatch: (watchId) => {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
    set({ _watchId: null });
  },
}));
