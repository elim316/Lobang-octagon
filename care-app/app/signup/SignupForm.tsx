"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/ToastContainer";
import { designSystem } from "@/lib/ui/design-system";

interface SignupFormProps {
  onSignupSuccess: (id: string) => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showToast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validations
    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErrorMsg(msg);
      showToast(msg, "error");
      return;
    }

    if (password !== confirm) {
      const msg = "Passwords do not match.";
      setErrorMsg(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      showToast(error.message, "error");
      return;
    }

    if (data.user) {
      showToast("Account created successfully!", "success");
      onSignupSuccess(data.user.id);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: designSystem.spacing.md }}>
      <Input
        id="email"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={errorMsg && errorMsg.includes("email") ? errorMsg : undefined}
        aria-label="Email address"
      />

      <Input
        id="password"
        placeholder="Password (min 6 characters)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={errorMsg && (errorMsg.includes("password") || errorMsg.includes("6 characters")) ? errorMsg : undefined}
        aria-label="Password"
      />

      <Input
        id="confirm"
        placeholder="Confirm password"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={errorMsg && errorMsg.includes("match") ? errorMsg : undefined}
        aria-label="Confirm password"
      />

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        style={{ marginTop: designSystem.spacing.md }}
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <Link
        href="/login"
        style={{
          textDecoration: "none",
          display: "block",
          textAlign: "center",
          fontSize: designSystem.typography.fontSize.bodySmall,
          color: designSystem.colors.text.secondary,
        }}
      >
        Already have an account? Log in
      </Link>
    </form>
  );
}