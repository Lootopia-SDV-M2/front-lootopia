"use client";

import { Marker, Circle } from "react-leaflet";
import L from "leaflet";
import type { HuntStep } from "@/types";

interface StepMarkerProps {
  step: HuntStep;
  index: number;
  status: "completed" | "current" | "locked";
}

function createStepIcon(
  index: number,
  status: "completed" | "current" | "locked"
): L.DivIcon {
  const colors = {
    completed: "#22c55e",
    current: "#c89a0e",
    locked: "#908e88",
  };

  const color = colors[status];
  const pulseStyle =
    status === "current"
      ? "animation: step-pulse 2s infinite; box-shadow: 0 0 0 0 rgba(200,154,14,0.4);"
      : "";

  return L.divIcon({
    className: "step-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 14px;
        ${pulseStyle}
      ">${index + 1}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function StepMarker({ step, index, status }: StepMarkerProps) {
  const icon = createStepIcon(index, status);

  return (
    <>
      <Marker position={[step.latitude, step.longitude]} icon={icon} />

      {status === "current" && (
        <Circle
          center={[step.latitude, step.longitude]}
          radius={step.radius}
          pathOptions={{
            color: "#c89a0e",
            fillColor: "#c89a0e",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "6 4",
          }}
        />
      )}
    </>
  );
}
