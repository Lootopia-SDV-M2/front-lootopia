"use client";

import { useState } from "react";
import { Scan, ShieldAlert } from "lucide-react";
import { PageContainer } from "@/components/shared";
import { Button } from "@/components/ui";
import { vouchersApi } from "@/lib/api/vouchers-api";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function ScanPage() {
  const { user } = useAuthStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isOrganizer = user?.role === "partner" || user?.role === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await vouchersApi.redeemVoucher(code.trim());
      setSuccess(result.message);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOrganizer) {
    return (
      <div className="min-h-screen pb-20 pt-20 md:pb-8">
        <PageContainer title="Valider un bon d'achat">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-status-error/20 bg-status-error/10">
              <ShieldAlert className="h-8 w-8 text-status-error" />
            </div>
            <h2 className="text-lg font-semibold text-text-heading">
              Acces reserve aux organisateurs
            </h2>
            <p className="mt-2 max-w-sm text-center text-sm text-text-muted">
              Cette page est reservee aux partenaires et administrateurs de
              Lootopia.
            </p>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-20 md:pb-8">
      <PageContainer
        title="Valider un bon d'achat"
        subtitle="Scannez ou saisissez le code du bon"
      >
        <div className="mx-auto max-w-md">
          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-medium text-text-heading"
              >
                Code du bon d'achat
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez le code UUID..."
                className="w-full rounded-xl border border-black/[0.08] bg-background-surface px-4 py-3 text-text-heading placeholder:text-text-muted/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              disabled={!code.trim()}
              className="w-full"
            >
              <Scan className="h-5 w-5" />
              Valider le bon
            </Button>
          </form>

          {/* Success message */}
          {success && (
            <div className="mb-4 rounded-xl border border-status-success/20 bg-status-success/10 p-4">
              <p className="font-medium text-status-success">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl border border-status-error/20 bg-status-error/10 p-4">
              <p className="font-medium text-status-error">{error}</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
