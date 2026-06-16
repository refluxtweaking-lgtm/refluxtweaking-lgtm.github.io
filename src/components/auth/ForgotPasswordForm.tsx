"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type AuthActionState } from "@/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-[rgba(255,107,91,0.45)] bg-gradient-to-r from-[#ff6b5b] to-[#e85a4d] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending link…" : "Send reset link"}
    </button>
  );
}

interface ForgotPasswordFormProps {
  sent?: boolean;
}

export function ForgotPasswordForm({ sent = false }: ForgotPasswordFormProps) {
  const [state, formAction] = useActionState<AuthActionState, FormData>(requestPasswordReset, null);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Image src="/favicon.ico" alt="REFLUX TWEAKS" width={32} height={32} className="rounded-md" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">REFLUX TWEAKS</span>
          </div>
        </div>

        <h1 className="mb-1 text-center text-2xl font-bold text-white">Forgot password?</h1>
        <p className="mb-6 text-center text-sm text-reflux-muted">
          Enter your email and we&apos;ll send a link to reset your password.
        </p>

        {sent && (
          <div className="mb-4 rounded-lg border border-reflux-green/30 bg-reflux-green/10 px-4 py-3 text-sm text-reflux-text">
            If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.
          </div>
        )}

        {!sent && (
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
              />
            </div>

            {state?.error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>
        )}

        <p className="mt-6 text-center text-sm text-reflux-muted">
          <Link href="/login" className="font-semibold text-reflux-accent hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
