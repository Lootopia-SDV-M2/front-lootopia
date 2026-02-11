"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, Mail, Lock, User, UserPlus, Search, Crown } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { Alert } from "@/components/shared";
import { useAuthStore } from "@/lib/stores";
import {
  registerSchema,
  evaluatePasswordStrength,
  type PasswordStrength,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

const strengthColors: Record<PasswordStrength, string> = {
  weak: "bg-status-error",
  fair: "bg-status-warning",
  good: "bg-primary",
  strong: "bg-status-success",
};

const strengthLabels: Record<PasswordStrength, string> = {
  weak: "Faible",
  fair: "Moyen",
  good: "Bon",
  strong: "Excellent",
};

type AccountRole = "CHERCHEUR" | "ORGANISATEUR";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading, error, clearError } = useAuthStore();

  const initialRole: AccountRole =
    searchParams.get("role")?.toLowerCase() === "organisateur"
      ? "ORGANISATEUR"
      : "CHERCHEUR";
  const [selectedRole, setSelectedRole] = useState<AccountRole>(initialRole);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const passwordStrength = evaluatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const success = await register(
      formData.username,
      formData.email,
      formData.password,
      selectedRole
    );
    if (success) {
      const user = useAuthStore.getState().user;
      router.push(user?.role === "partner" ? "/create" : "/map");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <Image
            src="/icons/favicon.png"
            alt="Lootopia"
            width={60}
            height={60}
            className="mx-auto mb-4 rounded-2xl shadow-glow"
          />
        </Link>
        <h1 className="font-heading text-3xl font-bold text-text-heading">
          Créer un Compte
        </h1>
        <p className="mt-2 text-text-muted">
          Rejoignez l&apos;aventure Lootopia !
        </p>
      </div>

      <Card variant="glass" className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Role selector */}
          <div>
            <label className="mb-3 block text-xs font-medium tracking-wider text-text-muted">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CHERCHEUR")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300",
                  selectedRole === "CHERCHEUR"
                    ? "border-primary/40 bg-primary/[0.08] text-primary shadow-glow-sm"
                    : "border-black/[0.06] bg-background-surface text-text-muted hover:border-black/[0.08]"
                )}
              >
                {selectedRole === "CHERCHEUR" && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    &#10003;
                  </div>
                )}
                <Search className="h-7 w-7" />
                <span className="font-heading text-sm font-bold">
                  Chercheur
                </span>
                <span className="text-[11px] opacity-60">
                  Participer aux chasses
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("ORGANISATEUR")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-300",
                  selectedRole === "ORGANISATEUR"
                    ? "border-secondary/40 bg-secondary/[0.08] text-secondary shadow-[0_0_20px_rgba(232,121,165,0.1)]"
                    : "border-black/[0.06] bg-background-surface text-text-muted hover:border-black/[0.08]"
                )}
              >
                {selectedRole === "ORGANISATEUR" && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                    &#10003;
                  </div>
                )}
                <Crown className="h-7 w-7" />
                <span className="font-heading text-sm font-bold">
                  Organisateur
                </span>
                <span className="text-[11px] opacity-60">
                  Créer des chasses
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-text-muted">
              Nom d&apos;utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type="text"
                name="username"
                placeholder="VotreNom"
                value={formData.username}
                onChange={handleChange}
                error={!!validationErrors.username}
                className="pl-11"
              />
            </div>
            {validationErrors.username && (
              <p className="mt-1 text-xs text-status-error">
                {validationErrors.username}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-text-muted">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                className="pl-11"
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-xs text-status-error">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-text-muted">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                className="pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-heading"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs text-status-error">
                {validationErrors.password}
              </p>
            )}
            {formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-surface-alt">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      strengthColors[passwordStrength.strength]
                    )}
                    style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-text-muted">
                  {strengthLabels[passwordStrength.strength]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wider text-text-muted">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                className="pl-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-heading"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs text-status-error">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 rounded border-black/[0.06] bg-background-surface-alt text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-text-muted">
                J&apos;accepte les{" "}
                <Link
                  href="/terms"
                  className="text-primary/80 hover:text-primary hover:underline"
                >
                  conditions d&apos;utilisation
                </Link>
              </span>
            </label>
            {validationErrors.acceptTerms && (
              <p className="mt-1 text-xs text-status-error">
                {validationErrors.acceptTerms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            <UserPlus className="h-5 w-5" />
            Créer mon compte
          </Button>
        </form>
      </Card>

      <p className="mt-8 text-center text-sm text-text-muted">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
