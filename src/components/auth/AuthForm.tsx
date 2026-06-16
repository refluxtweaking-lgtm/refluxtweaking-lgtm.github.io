"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp, type AuthActionState } from "@/app/auth/actions";

interface AuthFormProps {
  mode: "login" | "signup";
  notice?: string | null;
}

function SubmitButton({ mode }: { mode: "login" | "signup" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shimmer mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(241,91,80,0.5)] bg-gradient-to-r from-[rgba(241,91,80,0.25)] to-[rgba(241,91,80,0.12)] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:border-reflux-accent hover:from-[rgba(241,91,80,0.45)] hover:to-[rgba(241,91,80,0.25)] hover:shadow-[0_0_32px_rgba(241,91,80,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending
        ? mode === "login"
          ? "Logging in…"
          : "Creating account…"
        : mode === "login"
          ? "Log In"
          : "Create Account"}
    </button>
  );
}

export function AuthForm({ mode, notice }: AuthFormProps) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthActionState, FormData>(action, null);

  const isLogin = mode === "login";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-card-static rounded-2xl border border-reflux-border/60 bg-[rgba(10,12,17,0.85)] p-8 shadow-[0_0_60px_rgba(241,91,80,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Image src="/favicon.ico" alt="REFLUX TWEAKS" width={32} height={32} className="rounded-md" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-reflux-muted">
              REFLUX TWEAKS
            </span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-reflux-accent/40 to-transparent" />
        </div>

        <h1 className="mb-1 text-center text-2xl font-bold tracking-tight text-white">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mb-6 text-center text-sm text-reflux-muted">
          {isLogin
            ? "Log in to view your license keys."
            : "Sign up to manage your REFLUX PRO licenses."}
        </p>

        {notice && (
          <div className="mb-4 rounded-lg border border-reflux-accent/30 bg-[rgba(241,91,80,0.1)] px-4 py-3 text-sm text-reflux-text">
            {notice}
          </div>
        )}

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
              className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 transition-colors focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-reflux-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={8}
              placeholder="••••••••"
              className="rounded-xl border border-reflux-border/60 bg-[rgba(8,10,14,0.8)] px-4 py-2.5 text-sm text-white placeholder:text-reflux-muted/60 transition-colors focus:border-reflux-accent/60 focus:outline-none focus:ring-2 focus:ring-reflux-accent/20"
            />
            {isLogin && (
              <div className="mt-1.5 flex justify-end">
                <Link href="/forgot-password" className="text-xs font-medium text-reflux-muted hover:text-reflux-accent">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          {state?.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <SubmitButton mode={mode} />
        </form>

        <p className="mt-6 text-center text-sm text-reflux-muted">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-reflux-accent hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-reflux-accent hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
