"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Video, VideoOff, Compass } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { Alert } from "@/components/shared";

/**
 * A simple Augmented Reality view simulating an AR overlay on a camera feed.
 */
export function ARView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enableVideoStream = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            "La caméra n'est pas supportée par votre navigateur."
          );
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Prefer back camera
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            setError(
              "Vous avez refusé l'accès à la caméra. Veuillez l'activer dans les paramètres de votre navigateur."
            );
          } else if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            setError(
              "Aucune caméra compatible n'a été trouvée sur votre appareil."
            );
          } else {
            setError(`Erreur d'initialisation de la caméra: ${err.message}`);
          }
        } else {
          setError(
            "Une erreur inconnue est survenue lors de l'accès à la caméra."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    enableVideoStream();

    // Cleanup: stop video stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
        <Link href="/map">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-lg font-bold text-white">Mode RA</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <Video className="mb-4 h-10 w-10 animate-pulse" />
          <p className="text-lg font-medium">Activation de la caméra...</p>
          <p className="text-sm text-gray-400">Veuillez autoriser l'accès</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
          <Card variant="default" className="max-w-md text-center">
            <div className="p-6">
              <VideoOff className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h3 className="text-lg font-bold">Erreur de Caméra</h3>
              <Alert variant="error" className="mt-4 text-left">
                {error}
              </Alert>
              <Link href="/map" className="mt-6 block">
                <Button variant="secondary" className="w-full">
                  Retour à la carte
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* AR Overlay - The "Simulation" */}
      {stream && !isLoading && !error && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between p-8">
          {/* Top-left: Distance meter */}
          <div className="self-start rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
            <p className="text-xs">Distance</p>
            <p className="text-lg font-bold">25m</p>
          </div>

          {/* Center: Reticle/Target */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-white/50">
            <div className="h-4 w-4 rounded-full border-2 border-white bg-amber-400"></div>
          </div>

          {/* Bottom: Compass simulation */}
          <div className="flex flex-col items-center">
            <Compass className="h-16 w-16 text-white/80 drop-shadow-lg" />
            <p className="tracking-widder mt-2 text-2xl font-bold text-white drop-shadow-lg">
              NORD
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
