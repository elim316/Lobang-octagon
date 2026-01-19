"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Auto redirect countdown effect (used if email confirmation is required)
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown === 0) {
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    const t = setTimeout(() => {
      setRedirectCountdown((c) => (c === null ? null : c - 1));
    }, 1000);

    return () => clearTimeout(t);
  }, [redirectCountdown, router, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    // Basic Validations
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    /** 
     * SUCCESS LOGIC 
     * We trigger onSignupSuccess() to move to the "Role Selection" step.
     * We do this even if they need to confirm their email, so they can
     * finish setting up their profile data first.
     **/
    if (data.user) {
      onSignupSuccess();
      return;
    }

    // Fallback message if for some reason the step transition doesn't happen
    setInfoMsg("Account created. Please check your email.");
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        style={{ 
          padding: 12, 
          borderRadius: 10, 
          border: "1px solid #ddd",
          fontSize: "1rem" 
        }}
      />

      <input
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        style={{ 
          padding: 12, 
          borderRadius: 10, 
          border: "1px solid #ddd",
          fontSize: "1rem" 
        }}
      />

      <input
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        type="password"
        required
        style={{ 
          padding: 12, 
          borderRadius: 10, 
          border: "1px solid #ddd",
          fontSize: "1rem" 
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: 14,
          marginTop: 10,
          borderRadius: 10,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          background: "#111",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        style={{
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ddd",
          textDecoration: "none",
          color: "#111",
          display: "block",
          textAlign: "center",
          background: "#f7f7f7",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}
      >
        Back to login
      </Link>

      {errorMsg && (
        <p style={{ color: "crimson", margin: 0, fontSize: "0.9rem", textAlign: "center" }}>
          {errorMsg}
        </p>
      )}

      {infoMsg && (
        <p style={{ color: "#111", margin: 0, opacity: 0.85, fontSize: "0.9rem", textAlign: "center" }}>
          {infoMsg}
          {redirectCountdown !== null ? ` (${redirectCountdown}s)` : null}
        </p>
      )}
    </form>
  );
}



// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// export default function SignupForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const next = searchParams.get("next") || "/app";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [infoMsg, setInfoMsg] = useState<string | null>(null);
//   const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

//   // Auto redirect countdown effect
//   useEffect(() => {
//     if (redirectCountdown === null) return;

//     if (redirectCountdown === 0) {
//       router.push(`/login?next=${encodeURIComponent(next)}`);
//       return;
//     }

//     const t = setTimeout(() => {
//       setRedirectCountdown((c) => (c === null ? null : c - 1));
//     }, 1000);

//     return () => clearTimeout(t);
//   }, [redirectCountdown, router, next]);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     console.log("Submit button was clicked!"); // <--- ADD THIS LINE
//     console.log("Email:", email); 


//     setErrorMsg(null);
//     setInfoMsg(null);

//     if (password.length < 6) {
//       setErrorMsg("Password must be at least 6 characters.");
//       return;
//     }

//     if (password !== confirm) {
//       setErrorMsg("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     const supabase = createSupabaseBrowserClient();
//     const { data, error } = await supabase.auth.signUp({
//       email: email.trim(),
//       password,
//       options: {
//         emailRedirectTo: `${window.location.origin}/login`,
//       },
//     });

//     setLoading(false);

//     if (error) {
//       setErrorMsg(error.message);
//       return;
//     }

//     // If email confirmation is OFF, user has a session immediately
//     if (data.session) {
//       router.push(next);
//       router.refresh();
//       return;
//     }

//     // Email confirmation ON: show message + start auto redirect
//     setInfoMsg(
//       "Account created successfully. Please check your email to confirm your account. Redirecting to login..."
//     );
//     setRedirectCountdown(2); // seconds
//   }

//   return (
//     <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         type="email"
//         required
//         style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
//       />

//       <input
//         placeholder="Password (min 6 characters)"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         required
//         style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
//       />

//       <input
//         placeholder="Confirm password"
//         value={confirm}
//         onChange={(e) => setConfirm(e.target.value)}
//         type="password"
//         required
//         style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         style={{
//           padding: 10,
//           borderRadius: 10,
//           border: "1px solid #ddd",
//           cursor: loading ? "not-allowed" : "pointer",
//           background: "#fff",
//           fontWeight: 600,
//         }}
//       >
//         {loading ? "Creating account..." : "Create account"}
//       </button>

//       <Link
//         href={`/login?next=${encodeURIComponent(next)}`}
//         style={{
//           padding: 10,
//           borderRadius: 10,
//           border: "1px solid #ddd",
//           textDecoration: "none",
//           color: "#111",
//           display: "block",
//           textAlign: "center",
//           background: "#f7f7f7",
//           fontWeight: 600,
//         }}
//       >
//         Back to login
//       </Link>

//       {errorMsg ? (
//         <p style={{ color: "crimson", margin: 0 }}>{errorMsg}</p>
//       ) : null}

//       {infoMsg ? (
//         <p style={{ color: "#111", margin: 0, opacity: 0.85 }}>
//           {infoMsg}
//           {redirectCountdown !== null ? ` (${redirectCountdown}s)` : null}
//         </p>
//       ) : null}
//     </form>
//   );
// }
