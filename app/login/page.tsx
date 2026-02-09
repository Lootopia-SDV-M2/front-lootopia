"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BlurText } from "@/components/ui/blur-text";
import { Alert } from "@/components/shared";
import { useAuthStore } from "@/lib/stores";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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
    const result = loginSchema.safeParse(formData);
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

    const success = await login(
      formData.email,
      formData.password,
      formData.rememberMe
    );
    if (success) {
      const user = useAuthStore.getState().user;
      router.push(user?.role === "partner" ? "/create" : "/map");
    }
  };

  return (
    <AuroraBackground className="min-h-screen">
      <div className="z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105"
          >
            <Image
              src="/icons/favicon.png"
              alt="Lootopia"
              width={80}
              height={80}
              className="mx-auto mb-6 rounded-2xl shadow-lg"
            />
          </Link>
          <div className="space-y-2">
            <BlurText
              delay={0.2}
              className="font-heading text-4xl font-bold text-text-heading"
            >
              Connexion
            </BlurText>
            <p className="text-text-muted">Ravi de vous revoir, aventurier !</p>
          </div>
        </div>

        <Card className="premium-card p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert variant="error">{error}</Alert>}

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
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
                <p className="text-xs text-status-error">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs text-status-error">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-text-muted">Se souvenir de moi</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-hover hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-lg"
              isLoading={isLoading}
            >
              {!isLoading && <LogIn className="h-5 w-5" />}
              Se connecter
            </Button>
          </form>
        </Card>

        <p className="mt-8 text-center text-sm text-text-muted">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-bold text-primary hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </AuroraBackground>
  );
}
