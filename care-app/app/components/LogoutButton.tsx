"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      style={{
        width: "100%",
        marginTop: 16,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #eee",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        textAlign: "left",
      }}
    >
      Log out
    </button>
  );
}
