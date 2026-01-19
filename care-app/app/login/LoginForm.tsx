// app/login/LoginForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/ToastContainer";
import { designSystem } from "@/lib/ui/design-system";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      showToast(error.message, "error");
      return;
    }

    showToast("Successfully logged in!", "success");
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: designSystem.spacing.md }}>
      <Input
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        error={errorMsg && errorMsg.includes("email") ? errorMsg : undefined}
        aria-label="Email address"
      />
      <Input
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        error={errorMsg && errorMsg.includes("password") ? errorMsg : undefined}
        aria-label="Password"
      />

      <Button type="submit" disabled={loading} size="md">
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Sign up link (preserves ?next=...) */}
      <Link
        href={`/signup?next=${encodeURIComponent(next)}`}
        style={{
          textDecoration: "none",
          display: "block",
        }}
      >
        <Button variant="secondary" style={{ width: "100%" }}>
          Create an account
        </Button>
      </Link>
    </form>
  );
}
