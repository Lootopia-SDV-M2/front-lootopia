"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BlurText } from "@/components/ui/blur-text";
import { Alert } from "@/components/shared";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Veuillez saisir votre adresse email");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <AuroraBackground className="min-h-screen">
      <div className="z-10 w-full max-w-md px-4">
        <div className="mb-10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
          <div className="mt-8 space-y-2">
            <BlurText
              delay={0.2}
              className="font-heading text-4xl font-bold text-text-heading"
            >
              Mot de passe oublié
            </BlurText>
            <p className="text-text-muted">
              Recevez un lien pour réinitialiser votre mot de passe
            </p>
          </div>
        </div>

        <Card variant="glass" className="p-6 md:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <Alert variant="error">{error}</Alert>}

              <div className="space-y-1.5">
                <label className="text-xs font-medium tracking-wider text-text-muted">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="pl-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Send className="h-5 w-5" />
                Envoyer le lien
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-status-success/10">
                <Mail className="h-8 w-8 text-status-success" />
              </div>
              <p className="font-medium text-text-heading">Email envoyé</p>
              <p className="text-sm text-text-muted">
                Si un compte existe avec l&apos;adresse <strong>{email}</strong>
                , vous recevrez un lien de réinitialisation sous quelques
                minutes.
              </p>
              <Link href="/login">
                <Button variant="secondary">Retour à la connexion</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </AuroraBackground>
  );
}
