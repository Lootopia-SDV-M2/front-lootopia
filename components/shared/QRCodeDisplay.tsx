"use client";

import { useEffect, useState } from "react";
import { toDataURL } from "qrcode";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  value: string;
  className?: string;
}

export function QRCodeDisplay({ value, className }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await toDataURL(value, { width: 200, margin: 1 });
        setDataUrl(url);
      } catch {
        setDataUrl("");
      }
    };
    generateQR();
  }, [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {dataUrl ? (
        <img src={dataUrl} alt="QR Code" className="rounded-xl" />
      ) : (
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl bg-black/[0.04]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
        {copied ? "Code copie !" : "Copier le code"}
      </Button>
    </div>
  );
}
