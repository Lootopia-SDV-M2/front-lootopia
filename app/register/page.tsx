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
  weak: "bg-brand-danger",
  fair: "bg-yellow-500",
  good: "bg-brand-primary",
  strong: "bg-brand-accent",
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
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-2xl"
          />
        </Link>
        <h1 className="text-brand-light font-heading text-3xl font-bold">
          Créer un Compte
        </h1>
        <p className="text-brand-muted mt-2">
          Rejoignez l&apos;aventure Lootopia !
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Role selector */}
          <div>
            <label className="text-brand-muted mb-3 block font-heading text-sm font-bold uppercase tracking-wider">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("CHERCHEUR")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                  selectedRole === "CHERCHEUR"
                    ? "border-brand-primary bg-brand-primary/20 text-brand-primary shadow-brand-primary/25 ring-brand-primary/30 scale-[1.02] shadow-lg ring-2"
                    : "bg-brand-surface text-brand-muted hover:border-brand-primary/50 border-border"
                )}
              >
                {selectedRole === "CHERCHEUR" && (
                  <div className="bg-brand-primary absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                    &#10003;
                  </div>
                )}
                <Search className="h-8 w-8" />
                <span className="font-heading text-sm font-bold">
                  Chercheur
                </span>
                <span className="text-xs opacity-70">
                  Participer aux chasses
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("ORGANISATEUR")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                  selectedRole === "ORGANISATEUR"
                    ? "border-brand-accent bg-brand-accent/20 text-brand-accent shadow-brand-accent/25 ring-brand-accent/30 scale-[1.02] shadow-lg ring-2"
                    : "bg-brand-surface text-brand-muted hover:border-brand-accent/50 border-border"
                )}
              >
                {selectedRole === "ORGANISATEUR" && (
                  <div className="bg-brand-accent absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                    &#10003;
                  </div>
                )}
                <Crown className="h-8 w-8" />
                <span className="font-heading text-sm font-bold">
                  Organisateur
                </span>
                <span className="text-xs opacity-70">Créer des chasses</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-brand-muted mb-2 block font-heading text-sm font-bold uppercase tracking-wider">
              Nom d&apos;utilisateur
            </label>
            <div className="relative">
              <User className="text-brand-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
              <Input
                type="text"
                name="username"
                placeholder="VotreNom"
                value={formData.username}
                onChange={handleChange}
                error={!!validationErrors.username}
                className="pl-12"
              />
            </div>
            {validationErrors.username && (
              <p className="text-brand-danger mt-1 text-sm">
                {validationErrors.username}
              </p>
            )}
          </div>

          <div>
            <label className="text-brand-muted mb-2 block font-heading text-sm font-bold uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="text-brand-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
              <Input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                className="pl-12"
              />
            </div>
            {validationErrors.email && (
              <p className="text-brand-danger mt-1 text-sm">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-brand-muted mb-2 block font-heading text-sm font-bold uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="text-brand-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                className="pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-muted hover:text-brand-light absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Eye />
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-brand-danger mt-1 text-sm">
                {validationErrors.password}
              </p>
            )}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-dark h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        strengthColors[passwordStrength.strength]
                      )}
                      style={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-brand-light text-xs font-bold">
                    {strengthLabels[passwordStrength.strength]}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-brand-muted mb-2 block font-heading text-sm font-bold uppercase tracking-wider">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="text-brand-muted absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                className="pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-brand-muted hover:text-brand-light absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Eye />
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-brand-danger mt-1 text-sm">
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
                className="bg-brand-surface text-brand-primary focus:ring-brand-primary h-4 w-4 rounded border-border"
              />
              <span className="text-brand-muted text-sm">
                J&apos;accepte les{" "}
                <Link
                  href="/terms"
                  className="text-brand-accent hover:underline"
                >
                  conditions d&apos;utilisation
                </Link>
              </span>
            </label>
            {validationErrors.acceptTerms && (
              <p className="text-brand-danger mt-1 text-sm">
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

      <p className="text-brand-muted mt-8 text-center text-sm">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="text-brand-accent font-bold hover:underline"
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
