"use client";

import { useState, useEffect } from "react";
import { Package, Gift } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { QRCodeDisplay } from "@/components/shared/QRCodeDisplay";
import { vouchersApi, type VoucherResponse } from "@/lib/api/vouchers-api";
import { cn } from "@/lib/utils";

function VoucherCard({ voucher }: { voucher: VoucherResponse }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300",
        !voucher.active && "opacity-60 grayscale"
      )}
    >
      {/* Reward image */}
      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-background-surface-alt">
        {voucher.rewardImageUrl ? (
          <img
            src={voucher.rewardImageUrl}
            alt={voucher.rewardName}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <Package className="h-10 w-10 text-text-muted/40" />
        )}
      </div>

      {/* Info */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-text-heading">
          {voucher.rewardName}
        </h3>
        <p className="text-xs text-text-muted">{voucher.huntTitle}</p>
      </div>

      {/* Status badge */}
      <div className="mb-3">
        <span
          className={cn(
            "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
            voucher.active
              ? "border-status-success/20 bg-status-success/10 text-status-success"
              : "border-black/[0.08] bg-black/[0.04] text-text-muted"
          )}
        >
          {voucher.active ? "Actif" : "Utilise"}
        </span>
      </div>

      {/* QR Code (only if active) */}
      {voucher.active && (
        <div className="mt-4 flex justify-center">
          <QRCodeDisplay value={voucher.code} />
        </div>
      )}

      {/* Obtained date */}
      <p className="mt-3 text-center text-xs text-text-muted">
        Obtenu le {new Date(voucher.obtainedAt).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await vouchersApi.getMyVouchers();
        setVouchers(data);
      } catch {
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-20 md:pb-8">
      <PageContainer
        title="Mes bons d'achat"
        subtitle="Vos recompenses sous forme de bons"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : vouchers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Gift className="h-8 w-8 text-text-muted" />}
            title="Aucun bon d'achat"
            description="Completez une chasse pour en gagner un !"
          />
        )}
      </PageContainer>
    </div>
  );
}
